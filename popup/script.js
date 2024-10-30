const currentBrowser = typeof chrome === 'undefined' ? browser : chrome;

const languageSelectorElement = document.getElementById('languageSelect');
const convertToSiInputElement = document.getElementById('convertToSiInput');
const translateSpellInput = document.getElementById('translateSpellNamesInput');

if (languageSelectorElement) languageSelectorElement.addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "language": event.target.value });
  await reloadPage();
});

if (convertToSiInputElement) convertToSiInputElement.addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "convertUnits": event.target.checked });
  await reloadPage();
});

if (translateSpellInput) translateSpellInput.addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "translateSpellNames": event.target.checked });
  await reloadPage();
});

(async () => {
  const convertToSiState = await currentBrowser.storage.local.get("convertUnits").then((result) => {
    return result.convertUnits ?? true;
  });

  const translateSpellNamesState = await currentBrowser.storage.local.get("translateSpellNames").then((result) => {
    return result.translateSpellNames ?? true;
  });

  const selectedLanguage = await currentBrowser.storage.local.get("language").then((result) => {
    return result.language ?? "en-us";
  });

  if (languageSelectorElement) languageSelectorElement.value = selectedLanguage;
  if (convertToSiInputElement) convertToSiInputElement.checked = convertToSiState;
  if (translateSpellInput) translateSpellInput.checked = translateSpellNamesState;
})();

async function reloadPage() {
  const tab = await currentBrowser.tabs.query({ active: true, lastFocusedWindow: true });
  currentBrowser.scripting.executeScript({ target: { tabId: tab[0].id, allFrames: true }, func: () => window.location.reload() });
}
