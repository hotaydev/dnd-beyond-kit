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
      chrome.storage.local.set({ language: "pt-br" });
      return "pt-br";
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
          if (skillTitle == singleSkill.substring(0,3)) {
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
        if (skillAbbr == singleSkill.substring(0,3)) {
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
    const proficiencyText = proficiency.innerText.toLowerCase();
    proficiency.innerText = translations.proficiencies[proficiencyText] ?? proficiency.innerText;
  });

  proficiencyContents.forEach((proficiency) => {
    Object.keys(translations.proficiencies.values).forEach((value) => {
      proficiency.innerText = proficiency.innerText.replaceAll(value, translations.proficiencies.values[value]);
    });
  });
}

function translateAreaTitles(translations) {
  const titles = document.querySelectorAll('.ddbc-manage-icon__content');
  if (!titles) return;

  titles.forEach((title) => {
    const text = title.innerText.toLowerCase();
    title.innerText = translations.areaTitles[text] ?? title.innerText;
  });
}

function translateSubskills(translations) {
  const subSkills = document.querySelectorAll('.ct-skills__item .ct-skills__col--skill');
  const skillsName = document.querySelector('.ct-skills__header .ct-skills__col--skill .ct-skills__heading');
  if (!subSkills) return;

  subSkills.forEach((skill) => {
    const skillTitle = skill.innerText.toLowerCase();
    skill.innerText = translations.subskills[skillTitle] ?? skill.innerText;
    skill.title = skillTitle;
  });

  if (skillsName) skillsName.innerText = translations.subskills.skills.toUpperCase();
}

function translateTopBarMainContent(translations) {
  const restButtons = document.querySelectorAll('.ct-character-header-desktop__button-label');
  if (!restButtons) return;

  restButtons.forEach((button) => {
    const buttonText = button.innerText.toLowerCase();
    button.innerText = translations.main.rest[buttonText] ?? button.innerText;
  });
}

function translateWalkAndDefense(translations) {
  const restButtons = document.querySelectorAll('.ct-character-header-desktop__button-label');
  const proficiencyButton = document.querySelector('.ct-proficiency-bonus-box .ct-proficiency-bonus-box__heading');
  const walkingButton = document.querySelector('.ct-quick-info__box--speed .ct-speed-box__heading');
  const speedButton = document.querySelector('.ct-quick-info__box--speed .ct-speed-box__label');
  const inspirationButton = document.querySelector('.ct-inspiration .ct-inspiration__label');
  const iniciativeButton = document.querySelector('.ct-initiative-box .ct-combat__summary-label');
  const armorClass = document.querySelectorAll('.ddbc-armor-class-box .ddbc-armor-class-box__label');

  if (restButtons) {
    restButtons.forEach((button) => {
      const buttonText = button.innerText.toLowerCase();
      button.innerText = translations.main.rest[buttonText] ?? button.innerText;
    });
  }

  if (armorClass) {
    armorClass.forEach((armor) => {
      const text = armor.innerText.toLowerCase();
      armor.innerText = translations.main.defense[text] ?? armor.innerText;
    });
  }

  if (proficiencyButton) proficiencyButton.innerText = translations.main.proficiency;
  if (walkingButton) walkingButton.innerText = translations.main.walking;
  if (speedButton) speedButton.innerText = translations.main.speed;
  if (inspirationButton) inspirationButton.innerText = translations.main.inspiration;
  if (iniciativeButton) iniciativeButton.innerText = translations.main.initiative;
}

function translateHealth(translations) {
  const buttons = document.querySelectorAll('.ct-health-summary__hp-group .ct-health-summary__adjuster-action button span');
  const healthText = document.querySelectorAll('.ct-health-summary__hp-group .ct-health-summary__hp-item-label');
  const hitPoints = document.querySelector('.ct-health-summary #ct-health-summary-label');

  if (buttons) {
    buttons.forEach((button) => {
      const buttonText = button.innerText.toLowerCase();
      button.innerText = translations.main.life[buttonText] ?? button.innerText;
    });
  }

  if (healthText) {
    healthText.forEach((text) => {
      const textContent = text.innerText.toLowerCase();
      text.innerText = translations.main.life[textContent] ?? text.innerText;
    });
  }

  if (hitPoints) hitPoints.innerText = translations.main.life.hitPoints;
}

function translateActions(translations) {
  const actions = document.querySelectorAll('.ct-primary-box menu li button');
  if (!actions) return;

  actions.forEach((action) => {
    const actionContent = action.innerText.toLowerCase();
    action.innerText = translations.actions[actionContent] ?? action.innerText;
  });
}

function translateConditions(translations) {
  const conditions = document.querySelectorAll('.ct-combat__statuses .ct-combat__summary-label');
  if (!conditions) return;

  conditions.forEach((condition) => {
    const actionContent = condition.innerText.toLowerCase();
    condition.innerText = translations.main.conditions[actionContent] ?? condition.innerText;
  });
}

function minifyContent() {
  const footer = document.querySelector('footer');
  const megamenu = document.querySelector('div[name=megamenu] .mm-navbar');
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
    setTimeout(async () => await translateTab(translations, tab.innerText.toLowerCase()), 300);
  }));
}

async function translateTab(translations, tab) {
  let innerTabs;

  switch (tab) {
    case "ações":
    case "acciones":
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => innerTab.innerText = translations.actions.actions_types[innerTab.innerText.toLowerCase()] ?? innerTab.innerText);
      break;
    case "feitiços":
    case "hechizos":
      innerTabs = document.querySelectorAll('.ct-spells__casting .ct-spells-level-casting__info-group .ct-spells-level-casting__info-label');
      innerTabs.forEach((innerTab) => innerTab.innerText = translations.actions.spells_types[innerTab.innerText.toLowerCase()] ?? innerTab.innerText);
      break;
    case "inventário":
    case "inventario":
      innerTabs = document.querySelector('.ct-equipment-overview__weight-carried-label');
      innerTabs.innerText = translations.actions.inventory_types[innerTabs.innerText.toLowerCase()] ?? innerTabs.innerText;
      break;
    case "características":
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => innerTab.innerText = translations.actions.features_types[innerTab.innerText.toLowerCase()] ?? innerTab.innerText);
      break;
    case "descrição":
    case "descripción":
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => innerTab.innerText = translations.actions.description_types[innerTab.innerText.toLowerCase()] ?? innerTab.innerText);
      break;
    case "notas":
    case "notas":
      innerTabs = document.querySelectorAll('.ddbc-tab-options .ddbc-tab-options__nav .ddbc-tab-options__header-heading');
      innerTabs.forEach((innerTab) => innerTab.innerText = translations.actions.notes_types[innerTab.innerText.toLowerCase()] ?? innerTab.innerText);
      break;
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
    translateActions(translations);
    translateConditions(translations);
    translateProficiencies(translations);
    translateAreaTitles(translations);
    tabsListener(translations);
    translateTab(translations, 'ações');
  }

  minifyContent();
  setInterval(() => {
    document.title = document.title.split('\'s')[0] + " | D&D Beyond";
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
