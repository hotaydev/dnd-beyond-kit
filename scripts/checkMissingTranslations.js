// IMPORTANT: This feature is disabled by default and users need to enable it manually. We respect users' privacy.

let translationsArray = [];
let canSendMissingTranslations = false; // Deactivated by default

function isDiceString(input) {
  const diceRegex = /^\d+d\d+(?:[\+\-]\d+)?$/;
  return diceRegex.test(input);
}

function getUntranslatedContent(untranslatedContent) {
  if (!canSendMissingTranslations) return; // Deactivated by default

  if (translationsArray.length > 0) {
    const translationsMissingButNotSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissing") || '[]');

    const newTranslations = untranslatedContent.map((content) => {
      let trimmedText = content.trim();
      if (isDiceString(trimmedText)) return '';
      if (trimmedText === '*') return '';
      if (trimmedText === 'NaN') return '';
      if (trimmedText === 'm.') return '';
      if (trimmedText === 'kg.') return '';
      if (trimmedText.includes('.prefix__')) return '';
      if (/[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\uAC00-\uD7AF]/.test(trimmedText)) return ''; // Avoid Japanese, Chinese and Korean strings

      return trimmedText.replaceAll(/^[.,+º•):;]\s/g, '').replaceAll(/[.,+º•“”(:;]$/g, '').replaceAll("--", "").replace(/\d+$/, '').trim();
    }).filter((a) => a && a !== '' && a.length > 1);

    const combinedTranslations = [...new Set([...translationsMissingButNotSent, ...newTranslations])];
    const nonTranslatedContent = combinedTranslations.filter(item => !translationsArray.includes(item));
    localStorage.setItem("beyondKitTranslationsMissing", JSON.stringify(nonTranslatedContent));
  }

  checkIfHadPassed24HoursToSendMissingTranslations();
}

let isAlreadySending = false;
function sendMissingTranslations(translationsMissingButNotSent) {
  const translationsMissingAndSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissingAlreadySent") || '[]');

  const willSend = translationsMissingButNotSent.filter(item => !translationsMissingAndSent.includes(item));

  if (!isAlreadySending && willSend.length > 20) {
    isAlreadySending = true;
    willSend.shift(); // Remove first element. First element is, in most times, the name of the character from the sheet.
    fetch('https://n8n.hotay.dev/webhook/dnd-beyond-kit-translation-new-translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(willSend),
    }).then(() => {
      localStorage.setItem("beyondKitTranslationsMissingAlreadySent", JSON.stringify([...new Set([...translationsMissingAndSent, ...translationsMissingButNotSent])]));
      isAlreadySending = false;
    }).catch((err) => {
      // On error we just don't execute/retry nothing. This error will not impact the user.
      console.log(err);
      isAlreadySending = false;
    });
  }
}

function checkIfHadPassed24HoursToSendMissingTranslations() {
  const lastUpdatedTime = parseInt(localStorage.getItem("beyondKitLastUpdatedTime") || "0");
  const savedArrayOfTranslations = JSON.parse(localStorage.getItem("beyondKitTranslationsArray") || "[]");

  // Check if the difference is greater than 24 hours (24 * 60 * 60 * 1000 ms)
  const timeDifference = Date.now() - lastUpdatedTime;
  const passedMoreThan24Hours = timeDifference > 24 * 60 * 60 * 1000;

  if (passedMoreThan24Hours || savedArrayOfTranslations.length === 0) {
    const currentKnownTranslations = "https://raw.githubusercontent.com/hotaydev/dnd-beyond-kit/main/translations/base.json";

    fetch(currentKnownTranslations)
      .then(res => res.json())
      .then(data => {
        translationsArray = data;
        localStorage.setItem("beyondKitLastUpdatedTime", Date.now().toString());
        localStorage.setItem("beyondKitTranslationsArray", JSON.stringify(data));
      })
      .catch((err) => {
        // On error we just don't execute/retry nothing. This error will not impact the user.
        console.log(err);

        if (savedArrayOfTranslations.length > 0) {
          translationsArray = savedArrayOfTranslations;
        }
      });

    const translationsMissingButNotSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissing") || '[]');
    const translationsMissingAlreadySent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissingAlreadySent") || '[]');

    // Each time the user access the extension, if it have passed more than 24 hours, we send the missing translations
    if ((translationsMissingButNotSent.length - translationsMissingAlreadySent.length) > 20) {
      sendMissingTranslations(translationsMissingButNotSent)
    }
  } else {
    if (savedArrayOfTranslations.length > 0) {
      translationsArray = savedArrayOfTranslations;
    }
  }
}

function checkForMissingTranslations(parentElement) {
  let elements = getTextNodes(parentElement);
  const untranslatedContent = [];

  elements.forEach(element => {
    let originalText = element.textContent;

    // Avoid CSS Classes
    if (originalText.includes('.prefix__')) return;

    let matches = originalText.match(/[A-Za-zÀ-ž]+(?:[ '\u2019][A-Za-zÀ-ž]+|-[A-Za-zÀ-ž]+)*/g);
    if (matches) {
      matches.forEach(originalWord => {
        if (originalWord.length === 1) return;

        untranslatedContent.push(originalWord);
      });
    } else {
      untranslatedContent.push(originalText);
    }
  });
  getUntranslatedContent(untranslatedContent);
}

// Start function, called when page loads
(() => {
  // After 5 seconds, we call our main function for this script
  setTimeout(async () => {
    await currentBrowser.storage.local.get("sendMissingTranslations").then(async (result) => {
      canSendMissingTranslations = result.sendMissingTranslations ?? false; // Deactivated by default

      // If we can send missing translations, check if the extension language is English.
      // If the extension language is English, then `getUntranslatedContent()` is not called from `./translations.js`
      if (canSendMissingTranslations) {
        await currentBrowser.storage.local.get("language").then((result) => {

          if (!result.language || result.language === "en-us") {
            // Extension language is set to "English", so we call the function that gets the untranslated content
            // We do this here because the `translations.js` file don't try to translate content when the language is "English".
            setInterval(() => {
              checkForMissingTranslations(document.querySelector("main")); // Main content
              checkForMissingTranslations(document.querySelector(".ct-sidebar__portal")); // General side menu
              checkForMissingTranslations(document.querySelector("dialog")); // Mobile menu
            }, 2 * 1000); // Each 2 seconds
          }
        });
      }

    });
  }, 5 * 1000);
})()