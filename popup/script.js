const currentBrowser = typeof chrome === 'undefined' ? browser : chrome;

const languageSelectorElement = document.getElementById('languageSelect');
const convertToSiInputElement = document.getElementById('convertToSiInput');

if (languageSelectorElement) languageSelectorElement.addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "language": event.target.value });
  await reloadPage();
});

if (convertToSiInputElement) convertToSiInputElement.addEventListener('change', async (event) => {
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

  if (languageSelectorElement) languageSelectorElement.value = selectedLanguage;
  if (convertToSiInputElement) convertToSiInputElement.checked = toggleState;
})();

async function reloadPage() {
  const tab = await currentBrowser.tabs.query({ active: true, lastFocusedWindow: true });
  currentBrowser.scripting.executeScript({ target: { tabId: tab[0].id, allFrames: true }, func: () => window.location.reload() });
}
