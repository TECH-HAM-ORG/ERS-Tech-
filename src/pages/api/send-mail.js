import https from "https";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const wpUrl = new URL("https://blogs.erstech.org/wp-json/custom/v1/send-mail");
  const headers = { ...req.headers };
  delete headers.host;

  // blogs.erstech.org TLS cert is expired; rejectUnauthorized: false allows forwarding
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const proxyReq = https.request(
    wpUrl,
    {
      method: "POST",
      headers,
      agent,
      timeout: 10000,
    },
    (proxyRes) => {
      res.status(proxyRes.statusCode || 200);
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        if (key.toLowerCase() !== "transfer-encoding") {
          res.setHeader(key, value);
        }
      }
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    console.error("send-mail proxy error:", err.message);
    res.status(500).json({ message: "Submission failed" });
  });

  proxyReq.on("timeout", () => {
    proxyReq.destroy();
    res.status(504).json({ message: "Request timed out" });
  });

  req.pipe(proxyReq);
}

