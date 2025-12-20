console.log("[VOT WebExtension] Background script loaded");

// Инициализация при установке
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[VOT] Extension installed");

    // Установка настроек по умолчанию
    browser.storage.local.set({
      autoTranslate: false,
      defaultVolume: 100,
      autoSetVolumeYandexStyle: true,
      dontTranslateYourLang: false,
      syncVolume: false,
      responseLanguage: "ru",
      audioProxy: true,
      showPiPButton: false,
      subtitlesMaxLength: 300,
      highlightWords: false,
      m3u8ProxyHost: "media-proxy.toil.cc",
      proxyWorkerHost: "vot-worker.toil.cc",
      VOTLocalizedLanguages: {},
    });
  } else if (details.reason === "update") {
    console.log("[VOT] Extension updated");
  }
});

// Обработка сообщений от content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[VOT Background] Message received:", request);

  if (request.action === "getSettings") {
    browser.storage.local.get(null).then(sendResponse);
    return true; // Асинхронный ответ
  }

  if (request.action === "saveSetting") {
    browser.storage.local.set({ [request.key]: request.value }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});
