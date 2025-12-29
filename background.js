function setupContextMenu() {
  chrome.contextMenus.create({ id: "openInNewTab", title: "New Tab", contexts: ["all"] });
  chrome.contextMenus.create({ id: "openInNewWindow", title: "New Window", contexts: ["all"] });
}
chrome.runtime.onInstalled.addListener(() => chrome.contextMenus.removeAll(setupContextMenu));
chrome.contextMenus.onClicked.addListener((info) => {
  const newUrl = info.linkUrl || info.pageUrl;
  if (!newUrl) return;
  if (info.menuItemId === "openInNewTab") chrome.tabs.create({ url: newUrl, active: true });
  if (info.menuItemId === "openInNewWindow") chrome.windows.create({ url: newUrl, focused: true });
});


const PENDING = new Map();
const WINDOW_MS = 240;

function normalize(u) { try { const x = new URL(u); x.hash = ""; return x.href; } catch { return u || ""; } }

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "maybeOpenOnMiddle" && msg.url) {
    const key = normalize(msg.url);
    if (PENDING.has(key)) clearTimeout(PENDING.get(key).timer);
    const timer = setTimeout(() => {
      chrome.tabs.create({ url: msg.url, active: false });
      PENDING.delete(key);
    }, WINDOW_MS);
    PENDING.set(key, { timer, url: msg.url });
    sendResponse?.({ ok: true });
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  const created = normalize(tab.pendingUrl || tab.url || "");
  if (!created) return;
  if (PENDING.has(created)) {
    clearTimeout(PENDING.get(created).timer);
    PENDING.delete(created);
  }
});
