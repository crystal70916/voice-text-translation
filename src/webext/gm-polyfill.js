// Polyfill для GM_* функций в WebExtension окружении
if (typeof GM_info === "undefined") {
  window.GM_setValue = async (key, value) => {
    return browser.storage.local.set({ [key]: value });
  };

  window.GM_getValue = async (key, defaultValue) => {
    const result = await browser.storage.local.get(key);
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
    return fetch(details.url, {
      method: details.method || "GET",
      headers: details.headers,
      body: details.data,
      credentials: details.anonymous ? "omit" : "include",
    })
      .then((response) => {
        return response.text().then((text) => {
          const result = {
            status: response.status,
            statusText: response.statusText,
            responseText: text,
            response: text,
            responseHeaders: response.headers,
          };

          if (details.onload) {
            details.onload(result);
          }

          return result;
        });
      })
      .catch((error) => {
        if (details.onerror) {
          details.onerror(error);
        }
        throw error;
      });
  };

  window.GM_addStyle = (css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
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
}
