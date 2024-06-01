const matchPatternOMM = /^https:\/\/multiverse\.com\/verses\/.*\/session\/.*$/;
const matchPatternDND = /^https:\/\/www\.dndbeyond\.com\/characters\/.*$/;

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.dice_roll) {
      // A dice was rolled in D&D Beyond, we need to replicate to OMM

      const tabs = await chrome.tabs.query({});

      let diceWasRolledInOMM = false;
      await tabs.forEach(async tab => {
        if (tab.url && matchPatternOMM.test(tab.url)) {
          diceWasRolledInOMM = true;
          await chrome.tabs.sendMessage(tab.id, { dice_roll: request.dice_roll });
          await chrome.tabs.update(tab.id, { active: true });
        }
      });

      await tabs.forEach(async tab => {
        if (tab.url && matchPatternDND.test(tab.url)) {
          await chrome.tabs.sendMessage(tab.id, { roll_dice: diceWasRolledInOMM });
          await chrome.tabs.update(tab.id, { muted: diceWasRolledInOMM });
        }
      });
    }
  }
);
