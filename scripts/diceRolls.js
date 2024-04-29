
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

    btn.onclick = () => {
      const diceBeingRolled = extractText(btn);
      console.log(diceBeingRolled);

      if (prevAct) prevAct();
    };
  });
}

function extractText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return addD20(node.textContent);
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SVG' || node.tagName === 'IMG') {
      return '';
    }
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

(() => {
  runWhenPageReady_dice();
})();