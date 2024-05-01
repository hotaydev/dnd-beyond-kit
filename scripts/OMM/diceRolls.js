let DOMelements = {
  logsMenu: undefined,
  dicePanel: undefined,
};

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
    const diceBeingRolled = extractText(btn);
    btn.onclick = async () => await chrome.runtime.sendMessage({dice_roll: diceBeingRolled});
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

function selectElement(element, key) {
  let interval = setInterval(() => {
    const selectedElement = document.querySelector(element);
    if (selectedElement) {
      DOMelements[key] = selectedElement;
      clearInterval(interval);
    }
  }, 200);
}

function changeOpacityWhenFound(opacity) {
  let interval = setInterval(() => {
    if (DOMelements.logsMenu) DOMelements.logsMenu.style.opacity = opacity;
    if (DOMelements.dicePanel) DOMelements.dicePanel.style.opacity = opacity;
    if (DOMelements.dicePanel && DOMelements.logsMenu) clearInterval(interval);
  }, 200);
}

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (!DOMelements.logsMenu) selectElement('#noty_layout__bottomRight', 'logsMenu');
    if (!DOMelements.dicePanel) selectElement('.dice-rolling-panel', 'dicePanel');
    changeOpacityWhenFound(request.roll_dice ? 0 : 100);
  }
);

(() => {
  runWhenPageReady_dice();
})();
