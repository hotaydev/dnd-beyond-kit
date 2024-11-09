const currentBrowser = typeof chrome === 'undefined' ? browser : chrome;

const chromeExtensionLink = "https://chromewebstore.google.com/detail/dnd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg";
const firefoxExtensionLink = "https://addons.mozilla.org/en-US/firefox/addon/dnd-beyond-kit/";

const languageSelectorElement = document.getElementById('languageSelect');
const convertToSiInputElement = document.getElementById('convertToSiInput');
const translateSpellInput = document.getElementById('translateSpellNamesInput');
const cleanInterfaceInput = document.getElementById('cleanInterfaceInput');
const leaveAReviewLink = document.getElementById('leaveAReview');
const closeReviewQuestion = document.querySelector('.close-area .close');
const reviewArea = document.getElementById('review-area');

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

if (cleanInterfaceInput) cleanInterfaceInput.addEventListener('change', async (event) => {
  currentBrowser.storage.local.set({ "cleanInterface": event.target.checked });
  await reloadPage();
});

if (closeReviewQuestion) closeReviewQuestion.addEventListener('click', async (event) => {
  reviewArea.classList.add('d-none');
  currentBrowser.storage.local.set({ "askForReview": 1 });
});

(async () => {
  const convertToSiState = await currentBrowser.storage.local.get("convertUnits").then((result) => {
    return result.convertUnits ?? true;
  });

  const translateSpellNamesState = await currentBrowser.storage.local.get("translateSpellNames").then((result) => {
    return result.translateSpellNames ?? true;
  });

  const cleanInterfaceState = await currentBrowser.storage.local.get("cleanInterface").then((result) => {
    return result.cleanInterface ?? true;
  });

  const selectedLanguage = await currentBrowser.storage.local.get("language").then((result) => {
    return result.language ?? "en-us";
  });

  await currentBrowser.storage.local.get("askForReview").then((result) => {
    if (!result.askForReview) {
      currentBrowser.storage.local.set({ "askForReview": 20 });
      if (reviewArea) reviewArea.classList.remove('d-none');
    } else if (parseInt(result.askForReview) >= 20) {
      if (reviewArea) reviewArea.classList.remove('d-none');
    } else {
      currentBrowser.storage.local.set({ "askForReview": parseInt(result.askForReview) + 1 });
    }
  });

  if (languageSelectorElement) languageSelectorElement.value = selectedLanguage;
  if (convertToSiInputElement) convertToSiInputElement.checked = convertToSiState;
  if (translateSpellInput) translateSpellInput.checked = translateSpellNamesState;
  if (cleanInterfaceInput) cleanInterfaceInput.checked = cleanInterfaceState;
  if (leaveAReviewLink) leaveAReviewLink.href = typeof chrome === 'undefined' ? firefoxExtensionLink : chromeExtensionLink;
})();

async function reloadPage() {
  const tab = await currentBrowser.tabs.query({ active: true, lastFocusedWindow: true });
  currentBrowser.scripting.executeScript({ target: { tabId: tab[0].id, allFrames: true }, func: () => window.location.reload() });
}
