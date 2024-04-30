
chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.dice_roll) {
      console.log(request.dice_roll);
    }
  }
);
