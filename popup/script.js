var currentBrowser = typeof chrome === 'undefined' ? browser : chrome;

document.getElementById('languageSelect').addEventListener('change', (event) => {
  currentBrowser.storage.local.set({"language": event.target.value});
});