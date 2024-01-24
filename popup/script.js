document.getElementById('languageSelect').addEventListener('change', async (event) => {
  chrome.storage.local.set({"language": event.target.value});

  const tab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.scripting.executeScript({target: {tabId: tab[0].id, allFrames: true}, func: () => window.location.reload()});
});
