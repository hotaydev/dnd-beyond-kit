let currentBrowser = typeof chrome === 'undefined' ? browser : chrome;

document.getElementById('languageSelect').addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "language": event.target.value });
  await reloadPage();
});

document.getElementById('convertToSiInput').addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "convertUnits": event.target.checked });
  await reloadPage();
});

(async () => {
  const toggleState = await currentBrowser.storage.local.get("convertUnits").then((result) => {
    return result.convertUnits ?? true;
  });

  const selectedLanguage = await currentBrowser.storage.local.get("language").then((result) => {
    return result.language ?? "en-us";
  });

  document.getElementById('languageSelect').value = selectedLanguage;
  document.getElementById('convertToSiInput').checked = toggleState;
})();

async function reloadPage() {
  const tab = await currentBrowser.tabs.query({ active: true, lastFocusedWindow: true });
  currentBrowser.scripting.executeScript({ target: { tabId: tab[0].id, allFrames: true }, func: () => window.location.reload() });
}
