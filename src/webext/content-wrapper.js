// Wrapper для content script в WebExtension окружении
console.log("[VOT] Content wrapper loading...");

// Инициализируем GM API
window.GM_setValue = async (key, value) => {
  console.log("[VOT GM] setValue:", key, value);
  return browser.storage.local.set({ [key]: value });
};

window.GM_getValue = async (key, defaultValue) => {
  const result = await browser.storage.local.get(key);
  console.log("[VOT GM] getValue:", key, "=", result[key] ?? defaultValue);
  return result[key] !== undefined ? result[key] : defaultValue;
};

window.GM_deleteValue = async (key) => {
  return browser.storage.local.remove(key);
};

window.GM_listValues = async () => {
  const allData = await browser.storage.local.get(null);
  return Object.keys(allData);
};

window.GM_xmlhttpRequest = (details) => {
  console.log("[VOT GM] xmlhttpRequest:", details.url);
  return fetch(details.url, {
    method: details.method || "GET",
    headers: details.headers,
    body: details.data,
  })
    .then(async (response) => {
      const text = await response.text();
      const result = {
        status: response.status,
        statusText: response.statusText,
        responseText: text,
        response: text,
      };

      if (details.onload) {
        details.onload(result);
      }

      return result;
    })
    .catch((error) => {
      console.error("[VOT GM] xmlhttpRequest error:", error);
      if (details.onerror) {
        details.onerror(error);
      }
      throw error;
    });
};

window.GM_addStyle = (css) => {
  const style = document.createElement("style");
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
};

window.GM_info = {
  script: {
    name: "Voice Over Translation",
    version: "1.10.4",
  },
  scriptHandler: "WebExtension",
  version: "1.10.4",
};

window.unsafeWindow = window;

console.log("[VOT] GM API initialized");

// Загружаем основной скрипт
import("../index.js")
  .then(() => {
    console.log("[VOT] Main script loaded");
  })
  .catch((err) => {
    console.error("[VOT] Failed to load main script:", err);
  });
