const { spawn } = require("child_process");
const http = require("http");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) {
        const json = await res.json();
        return json.webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(500);
  }
  throw new Error("Could not connect to Chrome/Edge debugging port 9222");
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error("Evaluation error: " + JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log("Connecting to browser at 127.0.0.1:9222...");
  const wsBrowserUrl = await getDebuggerUrl();
  console.log("Browser WebSocket URL:", wsBrowserUrl);

  // Create a new tab target
  const newTabRes = await fetch("http://127.0.0.1:9222/json/new", { method: "PUT" });
  const newTab = await newTabRes.json();
  console.log("Created target tab:", newTab.id, newTab.webSocketDebuggerUrl);

  const client = new CdpClient(newTab.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  const results = {
    tabs: {},
    modal: {},
    mobileMenu: {},
  };

  // ==========================================
  // TEST 2: About-Hero Tabs
  // ==========================================
  console.log("\n--- TEST 2: About-Hero Tabs Computed Styles ---");
  await client.send("Page.navigate", { url: "http://localhost:3000/about-us" });
  await sleep(2500);

  const tabsData = await client.eval(`
    (() => {
      const tabs = Array.from(document.querySelectorAll('.MuiTabs-root button.MuiTab-root'));
      const indicator = document.querySelector('.MuiTabs-indicator');
      
      const tabDetails = tabs.map((t, i) => {
        const cs = window.getComputedStyle(t);
        const typ = t.querySelector('span, p, h6') || t;
        const typCs = window.getComputedStyle(typ);
        return {
          index: i,
          text: t.innerText.trim(),
          selected: t.getAttribute('aria-selected') === 'true',
          tab: {
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            textTransform: cs.textTransform,
            color: cs.color,
            padding: cs.padding,
            minHeight: cs.minHeight,
            minWidth: cs.minWidth
          },
          label: {
            fontSize: typCs.fontSize,
            fontWeight: typCs.fontWeight,
            textTransform: typCs.textTransform,
            color: typCs.color,
            fontFamily: typCs.fontFamily
          }
        };
      });

      const indCs = indicator ? window.getComputedStyle(indicator) : null;
      const indicatorDetail = indCs ? {
        backgroundColor: indCs.backgroundColor,
        height: indCs.height,
        color: indCs.color
      } : null;

      return { tabDetails, indicatorDetail };
    })()
  `);

  console.log("About-Hero Tabs Details:", JSON.stringify(tabsData, null, 2));
  results.tabs = tabsData;

  // Click second tab to test transition and selected vs unselected styles
  await client.eval(`
    (() => {
      const tabs = Array.from(document.querySelectorAll('.MuiTabs-root button.MuiTab-root'));
      if (tabs[1]) tabs[1].click();
    })()
  `);
  await sleep(1000);

  const tab2Selected = await client.eval(`
    (() => {
      const tabs = Array.from(document.querySelectorAll('.MuiTabs-root button.MuiTab-root'));
      return tabs.map(t => ({
        text: t.innerText.trim(),
        selected: t.getAttribute('aria-selected') === 'true'
      }));
    })()
  `);
  console.log("Tabs after clicking tab 2:", tab2Selected);

  // ==========================================
  // TEST 3: FormModal.js
  // ==========================================
  console.log("\n--- TEST 3: FormModal.js Styles & Behavior ---");
  await client.send("Page.navigate", { url: "http://localhost:3000/careers" });
  await sleep(2500);

  // Click the 'other' or apply button to open FormModal
  const openResult = await client.eval(`
    (() => {
      // Find Apply button or 'other' button
      const btns = Array.from(document.querySelectorAll('button'));
      const applyBtn = btns.find(b => b.innerText.includes('Apply Now') || b.innerText.toLowerCase().includes('other') || b.innerText.toLowerCase().includes('apply'));
      if (applyBtn) {
        applyBtn.click();
        return { clicked: true, text: applyBtn.innerText };
      }
      return { clicked: false };
    })()
  `);
  console.log("Open modal button click result:", openResult);
  await sleep(1000);

  const modalStyles = await client.eval(`
    (() => {
      // Find modal element and backdrop
      const modal = document.querySelector('.MuiModal-root');
      const backdrop = document.querySelector('.MuiBackdrop-root') || document.querySelector('[class*="StyledBackdrop"]');
      const submitBtn = document.querySelector('.send-msg-btn');
      const uploadBtn = document.querySelector('label span.MuiButton-root, label span');

      const bCs = backdrop ? window.getComputedStyle(backdrop) : null;
      const sCs = submitBtn ? window.getComputedStyle(submitBtn) : null;
      const uCs = uploadBtn ? window.getComputedStyle(uploadBtn) : null;

      return {
        isOpen: !!modal && modal.getAttribute('aria-hidden') !== 'true',
        backdrop: bCs ? {
          backgroundColor: bCs.backgroundColor,
          position: bCs.position,
          zIndex: bCs.zIndex
        } : null,
        submitButton: sCs ? {
          textTransform: sCs.textTransform,
          padding: sCs.padding,
          color: sCs.color,
          borderRadius: sCs.borderRadius,
          background: sCs.background || sCs.backgroundImage
        } : null,
        uploadButton: uCs ? {
          textTransform: uCs.textTransform,
          padding: uCs.padding,
          color: uCs.color,
          borderRadius: uCs.borderRadius
        } : null
      };
    })()
  `);
  console.log("Modal & Button computed styles:", JSON.stringify(modalStyles, null, 2));
  results.modal = modalStyles;

  // Test Backdrop Click closing
  console.log("Testing closing modal by clicking backdrop...");
  await client.eval(`
    (() => {
      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        backdrop.click();
      }
    })()
  `);
  await sleep(1000);

  const isClosedAfterBackdrop = await client.eval(`
    (() => {
      const modal = document.querySelector('.MuiModal-root');
      return !modal || modal.style.display === 'none' || modal.getAttribute('aria-hidden') === 'true';
    })()
  `);
  console.log("Modal closed after backdrop click:", isClosedAfterBackdrop);

  // Test Escape Key closing
  console.log("Re-opening modal to test Escape key...");
  await client.eval(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const applyBtn = btns.find(b => b.innerText.includes('Apply Now') || b.innerText.toLowerCase().includes('other') || b.innerText.toLowerCase().includes('apply'));
      if (applyBtn) applyBtn.click();
    })()
  `);
  await sleep(1000);

  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    windowsVirtualKeyCode: 27,
    key: "Escape",
    code: "Escape"
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    windowsVirtualKeyCode: 27,
    key: "Escape",
    code: "Escape"
  });
  await sleep(1000);

  const isClosedAfterEscape = await client.eval(`
    (() => {
      const modal = document.querySelector('.MuiModal-root');
      return !modal || modal.style.display === 'none' || modal.getAttribute('aria-hidden') === 'true';
    })()
  `);
  console.log("Modal closed after Escape key:", isClosedAfterEscape);

  // ==========================================
  // TEST 4: Mobile Menu at 390px Viewport
  // ==========================================
  console.log("\n--- TEST 4: Mobile Menu at 390px Viewport ---");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await client.send("Page.navigate", { url: "http://localhost:3000/" });
  await sleep(2500);

  // 1. Open mobile menu
  const menuOpened = await client.eval(`
    (() => {
      const trigger = document.querySelector('.menu-mobile-trigger');
      if (trigger) {
        trigger.click();
        return true;
      }
      return false;
    })()
  `);
  console.log("Mobile menu trigger clicked:", menuOpened);
  await sleep(800);

  const menuActiveState = await client.eval(`
    (() => {
      const menu = document.querySelector('.menu');
      return menu ? menu.classList.contains('active') : false;
    })()
  `);
  console.log("Mobile menu is active:", menuActiveState);

  // 2. Tap Company (menu-item-has-children)
  const initialUrl = await client.eval(`window.location.href`);
  console.log("Initial URL before tapping Company:", initialUrl);

  const companyClicked = await client.eval(`
    (() => {
      const items = Array.from(document.querySelectorAll('.menu-item-has-children'));
      const companyItem = items.find(i => i.innerText.includes('Company'));
      if (companyItem) {
        const link = companyItem.querySelector('a, span');
        (link || companyItem).click();
        return true;
      }
      return false;
    })()
  `);
  console.log("Tapped Company item:", companyClicked);
  await sleep(800);

  const urlAfterCompany = await client.eval(`window.location.href`);
  const submenuTitleAfterCompany = await client.eval(`
    (() => {
      const titleEl = document.querySelector('.menu-mobile-title');
      return titleEl ? titleEl.innerText.trim() : null;
    })()
  `);
  console.log("URL after tapping Company (should not change):", urlAfterCompany, "No nav:", initialUrl === urlAfterCompany);
  console.log("Submenu title updated to:", submenuTitleAfterCompany);

  // 3. Test back arrow
  const backClicked = await client.eval(`
    (() => {
      const arrow = document.querySelector('.menu-mobile-arrow');
      if (arrow) {
        arrow.click();
        return true;
      }
      return false;
    })()
  `);
  console.log("Back arrow clicked:", backClicked);
  await sleep(800);

  const submenuTitleAfterBack = await client.eval(`
    (() => {
      const titleEl = document.querySelector('.menu-mobile-title');
      return titleEl ? titleEl.innerText.trim() : null;
    })()
  `);
  console.log("Submenu title after back (should be empty):", `"${submenuTitleAfterBack}"`);

  // 4. Tap a normal link (Services)
  const normalLinkClicked = await client.eval(`
    (() => {
      const links = Array.from(document.querySelectorAll('nav.menu ul li a'));
      const servicesLink = links.find(l => l.getAttribute('href') === '/services' || l.innerText.includes('Services'));
      if (servicesLink) {
        servicesLink.click();
        return true;
      }
      return false;
    })()
  `);
  console.log("Clicked normal link 'Services':", normalLinkClicked);
  await sleep(2500);

  const finalUrl = await client.eval(`window.location.href`);
  console.log("URL after clicking Services:", finalUrl, "Navigated successfully:", finalUrl.includes('/services'));

  client.close();
  console.log("\nALL HEADLESS BROWSER TESTS COMPLETE!");
}

main().catch(err => {
  console.error("Headless test error:", err);
  process.exit(1);
});

