async function getTranslations(lang) {

  if (lang === 'en-us') {
    return null;
  }

  const jsonUrl = chrome.runtime.getURL(`translations/${lang}.json`);

  return await fetch(jsonUrl)
    .then(res => res.json())
    .then(data => data);
}

async function languageOfTheExtension() {
  return await chrome.storage.local.get("language").then((result) => {

    if (!result.language) {
      chrome.storage.local.set({ language: "en-us" });
      return "en-us";
    }

    return result.language;
  });
}

function translateSkills(translations) {
  const skillBoxes = document.querySelectorAll('.ct-quick-info__abilities .ddbc-ability-summary__heading span');
  const skillsShort = document.querySelectorAll('.ddbc-saving-throws-summary__ability-name abbr');
  const skillsInList = document.querySelectorAll('.ct-skills__item .ct-skills__col--stat');

  if (skillBoxes) {
    skillBoxes.forEach((skill) => {
      const skillTitle = skill.innerText.toLowerCase();

      if (skillTitle.length > 3) {
        skill.innerText = (translations.skills[skillTitle].title ?? skill.innerText).toUpperCase();
      } else {
        Object.keys(translations.skills).forEach((singleSkill) => {
          if (skillTitle == singleSkill.substring(0, 3)) {
            skill.innerText = (translations.skills[singleSkill].abbr ?? skill.innerText).toUpperCase();
          }
        })
      }
    });
  }

  if (skillsInList) {
    skillsShort.forEach((skill) => {
      const skillTitle = skill.title.toLowerCase();
      skill.innerText = (translations.skills[skillTitle].abbr ?? skill.innerText).toUpperCase();
      skill.title = translations.skills[skillTitle].title ?? skill.title;
      skill.parentElement.style.zIndex = "100"
    });
  }


  if (skillsInList) {
    skillsInList.forEach((skill) => {
      const skillAbbr = skill.innerText.toLowerCase();
      Object.keys(translations.skills).forEach((singleSkill) => {
        if (skillAbbr == singleSkill.substring(0, 3)) {
          skill.innerText = (translations.skills[singleSkill].abbr ?? skill.innerText).toUpperCase();
        }
      })
    });
  }
}

function translateProficiencies(translations) {
  const proficiencyLabels = document.querySelectorAll('.ct-proficiency-groups__group-label');
  const proficiencyContents = document.querySelectorAll('.ct-proficiency-groups__group-items');
  if (!proficiencyLabels || !proficiencyContents) return;

  proficiencyLabels.forEach((proficiency) => {
    replaceTextIfFound(proficiency, translations, ['proficiencies']);
  });

  proficiencyContents.forEach((proficiency) => {
    Object.keys(translations.proficiencies.values).forEach((value) => {
      proficiency.innerText = proficiency.innerText.replaceAll(value, translations.proficiencies.values[value]);
    });
  });
}

function translateSenses(translations) {
  const sensesLabels = document.querySelectorAll('.ct-senses__callout-label');
  if (!sensesLabels) return;

  sensesLabels.forEach((sense) => {
    replaceTextIfFound(sense, translations, ['senses']);
  });

  const sensesSummary = document.querySelectorAll('.ct-senses__summary');
  if (!sensesSummary) return;

  sensesSummary.forEach((sense) => {
    replaceTextIfFound(sense, translations, ['senses']);
  });
}

function translateAreaTitles(translations) {
  const titles = document.querySelectorAll('.ddbc-manage-icon__content');
  if (!titles) return;

  titles.forEach((title) => {
    replaceTextIfFound(title, translations, ['areaTitles']);
  });

  const savingThrows = document.querySelector('.ct-saving-throws-box__info .ct-saving-throws-box__modifiers');
  if (savingThrows && savingThrows.innerText == "Saving Throw Modifiers") savingThrows.innerText = translations.areaTitles.savingThrowsModifiers ?? savingThrows.innerText;

  // Not actually working due to way D&D Beyond handle the tooltips.
  // const manageItems = document.querySelectorAll('.ddbc-tooltip[data-original-title="Manage"]');
  // if (manageItems) manageItems.forEach((item) => item.setAttribute('data-original-title', translations.areaTitles.manage));

  const manageMainButton = document.querySelector('.ddbc-character-tidbits__menu-callout button span');
  if (manageMainButton) replaceTextIfFound(manageMainButton, translations, ['areaTitles']);
}

function translateSubskills(translations) {
  const subSkills = document.querySelectorAll('.ct-skills__item .ct-skills__col--skill');
  if (!subSkills) return;

  subSkills.forEach((skill) => {
    replaceTextIfFound(skill, translations, ['subskills']);
  });

  const skillsName = document.querySelector('.ct-skills__header .ct-skills__col--skill .ct-skills__heading');
  const additionalSkills = document.querySelector('.ct-skills__additional');
  const proficiency = document.querySelector('.ct-skills__header .ct-skills__col--proficiency abbr');
  const modifier = document.querySelector('.ct-skills__header .ct-skills__col--stat abbr');

  if (skillsName) replaceTextIfFound(skillsName, translations, ['subskills']);
  if (additionalSkills) additionalSkills.innerText = translations.subskills.additionalSkills ?? additionalSkills.innerText;
  if (proficiency) proficiency.setAttribute('title', translations.subskills.proficiency);
  if (modifier) modifier.setAttribute('title', translations.subskills.modifier);
}

function translateTopBarMainContent(translations) {
  const restButtons = document.querySelectorAll('.ct-character-header-desktop__button-label');
  if (!restButtons) return;

  restButtons.forEach((button) => {
    replaceTextIfFound(button, translations, ['main', 'rest'])
  });
}

function translateWalkAndDefense(translations) {
  const restButtons = document.querySelectorAll('.ct-character-header-desktop__button-label');
  const proficiencyButton = document.querySelector('.ct-proficiency-bonus-box .ct-proficiency-bonus-box__heading');
  const walkingButton = document.querySelector('.ct-quick-info__box--speed .ct-speed-box__heading');
  const speedButton = document.querySelector('.ct-quick-info__box--speed .ct-speed-box__label');
  const inspirationButton = document.querySelector('.styles_label__Bj6YW');
  const iniciativeButton = document.querySelector('div[data-testid=combat-initiative-label]');
  const armorClass = document.querySelectorAll('.ddbc-armor-class-box .ddbc-armor-class-box__label');

  if (restButtons) {
    restButtons.forEach((button) => {
      replaceTextIfFound(button, translations, ['main', 'rest']);
    });
  }

  if (armorClass) {
    armorClass.forEach((armor) => {
      replaceTextIfFound(armor, translations, ['main', 'defense']);
    });
  }

  if (proficiencyButton) replaceTextIfFound(proficiencyButton, translations, ['main']);
  if (walkingButton) replaceTextIfFound(walkingButton, translations, ['main']);
  if (speedButton) replaceTextIfFound(speedButton, translations, ['main']);
  if (inspirationButton) replaceTextIfFound(inspirationButton, translations, ['main']);
  if (iniciativeButton) replaceTextIfFound(iniciativeButton, translations, ['main']);
}

function translateHealth(translations) {
  const buttons = document.querySelectorAll('.ct-health-summary__hp-group .ct-health-summary__adjuster-action button span');
  const healthText = document.querySelectorAll('.ct-health-summary__hp-group .ct-health-summary__hp-item-label');
  const hitPoints = document.querySelector('.ct-health-summary #ct-health-summary-label');

  if (buttons) {
    buttons.forEach((button) => {
      replaceTextIfFound(button, translations, ['main', 'life']);
    });
  }

  if (healthText) {
    healthText.forEach((text) => {
      replaceTextIfFound(text, translations, ['main', 'life']);
    });
  }

  if (hitPoints) hitPoints.innerText = translations.main.life.hitPoints;
}

function translateGlobalActions(translations) {
  const actions = document.querySelectorAll('.ct-primary-box menu li button');
  if (!actions) return;

  actions.forEach((action) => {
    replaceTextIfFound(action, translations, ['actions']);
  });
}

function translateActionsSubItems(translations) {
  const actionsLabel = document.querySelector('.ct-actions__attacks-heading');
  if (actionsLabel) {
    replaceTextIfFound(actionsLabel.childNodes[0], translations, ['actions', 'actions_items']);
  }

  const attacksPerAction = document.querySelector('.ct-actions__attacks-per-action');
  if (attacksPerAction) {
    replaceTextIfFound(attacksPerAction.childNodes[0], translations, ['actions', 'actions_items']);
  }

  let columnBaseStyle = ".ddbc-attack-table__col--";
  let columnNames = ["name", "range", "damage", "tohit", "notes"];
  columnNames.forEach(name => {
    let columnStyle = columnBaseStyle + name;
    let label = document.querySelector(columnStyle);
    replaceTextIfFound(label, translations, ['actions', 'actions_items']);
  });

  const combatActionsLabel = document.querySelectorAll('.ct-actions-list__basic-heading ');
  if (combatActionsLabel) {
    combatActionsLabel.forEach((label) => {
      replaceTextIfFound(label, translations, ['actions', 'actions_items']);
    });
  }

  const basicActions = document.querySelectorAll('.ct-basic-actions__action');
  if (basicActions) {
    basicActions.forEach((action) => {
      replaceTextIfFound(action.childNodes[0], translations, ['actions', 'actions_items']);
    });
  }

  const weaponsAndSpells = document.querySelectorAll('.ddbc-combat-attack__label span');
  if (weaponsAndSpells) {
    weaponsAndSpells.forEach((weaponOrSpell) => {
      replaceTextIfFound(weaponOrSpell, translations, ['weapons']);
      replaceTextIfFound(weaponOrSpell, translations, ['spells']);
    });
  }

  const metaItems = document.querySelectorAll('.ddbc-combat-attack__meta-item, .ddbc-note-components__component--plain');
  if (metaItems) {
    metaItems.forEach((item) => {
      replaceTextIfFound(item, translations, ['meta']);
    });
  }
}

function translateConditions(translations) {
  const conditions = document.querySelectorAll('.ct-combat__statuses .ct-combat__summary-label');
  if (!conditions) return;

  conditions.forEach((condition) => {
    replaceTextIfFound(condition, translations, ['main', 'conditions'])
  });
}

function minifyContent() {
  const footer = document.querySelector('footer');
  const megamenu = document.querySelector('div[name=megamenu] menu');
  const socials = document.querySelector('.site-bar__container .socials');
  const interactions = document.querySelector('.site-bar__container .user-interactions');
  const search = document.querySelector('.site-bar__container .site-search form .react-autosuggest__container');

  if (footer) footer.style.visibility = 'hidden';
  if (megamenu) megamenu.style.visibility = 'hidden';
  if (socials) socials.style.visibility = 'hidden';
  if (interactions) interactions.style.visibility = 'hidden';
  if (search) search.style.visibility = 'hidden';
}

function tabsListener(translations) {
  const tabs = document.querySelectorAll('.ct-primary-box menu li button');
  tabs.forEach((tab) => tab.addEventListener('click', async () => {
    setTimeout(async () => await translateTab(translations, tab.innerText.toLowerCase()), 50);
  }));
}

function actionTabsListener(translations) {
  const tabs = document.querySelectorAll('.ddbc-tab-options__header');
  tabs.forEach((tab) => tab.addEventListener('click', async () => {
    setTimeout(async () => await translateActionsSubItems(translations), 50);
  }));
}

async function translateTab(translations, tab) {
  let innerTabs;

  switch (tab) {
    case translations.actions.actions.toLowerCase():
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'actions_types']));
      translateActionsSubItems(translations);
      actionTabsListener(translations);
      break;
    case translations.actions.spells.toLowerCase():
      innerTabs = document.querySelectorAll('.ct-spells__casting .ct-spells-level-casting__info-group .ct-spells-level-casting__info-label');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'spells_types']));
      break;
    case translations.actions.inventory.toLowerCase():
      weight_carried = document.querySelector('.ct-equipment-overview__weight-carried-label');
      replaceTextIfFound(weight_carried, translations, ['actions', 'inventory_types'])
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'inventory_types']));
      break;
    case translations.actions["features & traits"].toLowerCase():
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'features_types']));
      break;
    case translations.actions.background.toLowerCase():
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'background_types']));
      break;
    case translations.actions.notes.toLowerCase():
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => replaceTextIfFound(innerTab, translations, ['actions', 'notes_types']));
      break;
  }
}

function replaceTextIfFound(obj, dictionary, path) {
  if (obj && typeof obj.textContent === 'string') {
    let currentText = obj.textContent.trim().toLowerCase();

    let subpart = dictionary;
    for (let key of path) {
      if (subpart.hasOwnProperty(key)) {
        subpart = subpart[key];
      } else {
        return;
      }
    }

    if (subpart.hasOwnProperty(currentText)) {
      obj.textContent = subpart[currentText];
    }
  }
}

async function translateContent() {
  const language = await languageOfTheExtension();
  const translations = await getTranslations(language);

  // Translations:
  if (translations) {
    translateSkills(translations);
    translateSubskills(translations);
    translateTopBarMainContent(translations);
    translateWalkAndDefense(translations);
    translateHealth(translations);
    translateGlobalActions(translations);
    translateActionsSubItems(translations);
    translateConditions(translations);
    translateSenses(translations);
    translateProficiencies(translations);
    translateAreaTitles(translations);
    tabsListener(translations);
    translateTab(translations, translations.actions.actions.toLowerCase());
  }

  minifyContent();
  setInterval(() => {
    const splittedTitle = document.title.split('\'s');
    if (splittedTitle.length > 1) document.title = splittedTitle[0] + " | D&D Beyond";
  }, 2000); // 2 seconds
}

async function runWhenPageReady() {
  if (document.querySelector(".ct-quick-info")) {
    await translateContent();
  } else {
    setTimeout(runWhenPageReady, 500);
  }
}


(async () => {
  await runWhenPageReady();
})()
