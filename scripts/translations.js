// `currentBrowser` is defined in ./metrics.js

async function getTranslations(lang) {

  if (lang === 'en-us') {
    return null;
  }

  const jsonUrl = currentBrowser.runtime.getURL(`translations/${lang}.json`);

  return await fetch(jsonUrl)
    .then(res => res.json())
    .then(data => data);
}

async function languageOfTheExtension() {
  return await currentBrowser.storage.local.get("language").then((result) => {

    if (!result.language) {
      currentBrowser.storage.local.set({ language: "en-us" });
      return "en-us";
    }

    return result.language;
  });
}

function translateHeaderBox(translations) {
  let paragraph = document.querySelector('.ct-character-header-desktop');
  translateTextInElements(paragraph, translations);
}

function translateQuickInfoBar(translations) {
  let paragraph = document.querySelector('.ct-quick-info');
  translateTextInElements(paragraph, translations);
}

function translateSavingThrowsBox(translations) {
  let paragraph = document.querySelector('.ct-subsection--abilities');
  translateTextInElements(paragraph, translations);
}

function translateSensesBox(translations) {
  let paragraph = document.querySelector('.ct-subsection--senses');
  translateTextInElements(paragraph, translations);
}

function translateProficienciesBox(translations) {
  let paragraph = document.querySelector('.ct-subsection--proficiency-groups');
  translateTextInElements(paragraph, translations);
}

function translateSkillsBox(translations) {
  let paragraph = document.querySelector('.ct-subsection--skills');
  translateTextInElements(paragraph, translations);
}

function translateCombatDefensesConditionsBoxes(translations) {
  let paragraph = document.querySelector('.ct-subsection--combat');
  translateTextInElements(paragraph, translations);
}

function translateActionBox(translations) {
  const tabs = document.querySelectorAll('.ddbc-tab-options__header');
  tabs.forEach((tab) => tab.addEventListener('click', async () => {
    setTimeout(() => translateActionBox(translations), 50);
  }));

  let paragraph = document.querySelector('.ct-subsection--primary-box');
  translateTextInElements(paragraph, translations);
}

function translateSideBar(translations) {
  let paragraph = document.querySelector('.ct-sidebar__inner');
  translateTextInElements(paragraph, translations);
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
    setTimeout(() => translateActionBox(translations), 50);
  }));
}

function translateTextInElements(parentElement, dictionary) {
  let elements = getTextNodes(parentElement);
  elements.forEach(element => {
    let originalText = element.textContent;
    let translatedString = translateWord(originalText, dictionary);
    if (originalText == translatedString) {
      let matches = translatedString.match(/[A-Za-z]+(?:[ '\u2019][A-Za-z]+|-[A-Za-z]+)*/g);
      if (matches) {
        matches.forEach(originalWord => {
          let translatedWord = translateWord(originalWord, dictionary);
          translatedString = translatedString.replace(originalWord, translatedWord);
        });
      }
    }
    element.textContent = translatedString;
  });
}

function translateWord(word, dictionary) {
  let lowerWord = word.toLowerCase();
  for (let value of Object.values(dictionary)) {
    if (value.hasOwnProperty(lowerWord)) {
      return value[lowerWord];
    }
  }
  return word;
}

function getTextNodes(parentElement) {
  let textNodes = [];

  function findTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
      textNodes.push(node);
    }
    node.childNodes.forEach(child => findTextNodes(child));
  }
  findTextNodes(parentElement);

  return textNodes;
}

async function translateContent() {
  const language = await languageOfTheExtension();
  const translations = await getTranslations(language);

  if (translations) {
    translateHeaderBox(translations);
    translateQuickInfoBar(translations);
    translateSavingThrowsBox(translations);
    translateSensesBox(translations);
    translateProficienciesBox(translations);
    translateSkillsBox(translations);
    translateCombatDefensesConditionsBoxes(translations);
    translateActionBox(translations);
    tabsListener(translations);

    document.addEventListener('click', function () {
      setTimeout(() => { // Wait till the sidebar is open, then translate it
        const sidebarIsOpen = document.querySelector('.ct-sidebar__portal .ct-sidebar__inner .ct-sidebar__header');
        if (sidebarIsOpen) {
          translateSideBar(translations);
          translateActionBox(translations);
        }
      }, 100);
    }, true); // Don't remove this "true"
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
