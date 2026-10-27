export const isIphone = () => {
  if (typeof window === "undefined") return false;

  const userAgentData = navigator.userAgentData;
  if (userAgentData && userAgentData.platform) {
    return userAgentData.platform.toLowerCase() === "iphone";
  }

  const userAgent = navigator.userAgent || window.opera;
  return /iPhone/i.test(userAgent);
};
