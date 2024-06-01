
chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.dice_roll) {
      await rollDice(request.dice_roll);
    }
  }
);

async function rollDice(dice) {
  const roll = `!roll ${dice}`;

  const expandBtn = document.querySelector('#browserDefaultContextMenuDisabler > div:nth-child(2) div > div:nth-child(1) > div:nth-child(2)[data-cy-pod-toggler=true]');
  if (!expandBtn.classList.contains('isOpen')) {
    expandBtn.click();
  }

  await sleep(100);
  const chatBtn = document.querySelector('#browserDefaultContextMenuDisabler > div:nth-child(2) div div div div[data-cy-pod-icon-type="chat"]');
  if (chatBtn.attributes.getNamedItem('aria-selected').value === "false") {
    chatBtn.click();
  }

  await sleep(100);
  const msgInput = document.querySelector('#browserDefaultContextMenuDisabler > div:nth-child(2) div > div:nth-child(2) > div:nth-child(2)[data-cy-chat-input-container="true"] input');

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(msgInput, roll);
  msgInput.dispatchEvent(new Event('input', { bubbles: true }));
  msgInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13, bubbles: true }));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
