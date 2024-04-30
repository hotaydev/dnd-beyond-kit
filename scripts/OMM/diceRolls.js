
function runWhenPageReady_dice() {
  if (document.querySelector(".ct-quick-info")) {
    logDiceRolls();
  } else {
    setTimeout(runWhenPageReady_dice, 500);
  }
}

function logDiceRolls() {
  const allDiceRollButtons = document.querySelectorAll('.integrated-dice__container');

  allDiceRollButtons.forEach((btn) => {
    const prevAct = btn.onclick; // It's the 3D dice roll action
    const diceBeingRolled = extractText(btn);

    btn.onclick = async () => {
      await chrome.runtime.sendMessage({dice_roll: diceBeingRolled});
      if (prevAct) prevAct();
    };
  });
}

function extractText(node) {
  if (node.nodeType === Node.TEXT_NODE) return addD20(node.textContent);

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SVG' || node.tagName === 'IMG') return '';
    let text = '';
    node.childNodes.forEach(childNode => {
      text += extractText(childNode) + ' ';
    });
    return addD20(text);
  }
  return '1d20'; // default to a 1d20 roll
}

function addD20(roll) {
  if (roll.charAt(0) === '+') return "1d20" + roll.replace(/\s+/g, '');
  return roll.replace(/\s+/g, '');
}

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    const logsMenu = document.querySelector('#noty_layout__bottomRight');
    const dicePanel = document.querySelector('.dice-rolling-panel');

    if (request.roll_dice) {

      const div = document.createElement('div');
      div.innerText = chrome.i18n.getMessage("successSendingToOMM");
      div.classList.add('toast_notification');
      document.body.appendChild(div);

      setTimeout(() => {
        div.remove();
      }, 2500);

      if (logsMenu) logsMenu.style.opacity=0;
      if (dicePanel) dicePanel.style.opacity=0;

      document.querySelectorAll('audio, video').forEach(item => {
        item.muted = true;
        item.pause();
      });
    } else {
      if (logsMenu) logsMenu.style.opacity=100;
      if (dicePanel) dicePanel.style.opacity=100;
    }
  }
);

(() => {
  runWhenPageReady_dice();
})();
