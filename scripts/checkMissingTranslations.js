// Something similar to this script need to be added to the extension, so we have a way to detect new content from different D&D races.
// IMPORTANT: this feature need to be disabled by default and users need to be able to enable it manually, because we respect users' privacy.

let translationsArray = [];
let canSendMissingTranslations = false; // Deactivated by default

function isDiceString(input) {
  const diceRegex = /^\d+d\d+(?:[\+\-]\d+)?$/;
  return diceRegex.test(input);
}

function getUntranslatedContent(untranslatedContent) {
  if (!canSendMissingTranslations) return; // Deactivated by default

  const translationsMissingButNotSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissing") || '[]');

  const newTranslations = untranslatedContent.map((content) => {
    let trimmedText = content.trim();
    if (isDiceString(trimmedText)) return '';
    if (trimmedText === '*') return '';
    if (trimmedText === 'NaN') return '';
    if (trimmedText === 'm.') return '';
    if (trimmedText === 'kg.') return '';
    if (trimmedText.includes('.prefix__')) return '';

    return trimmedText.replace(/^[.,+•):;]\s/, '').replace(/[.,+•“”(:;]$/, '').replaceAll("--", "").replace(/\d+$/, '').trim();
  }).filter((a) => a !== '');

  const combinedTranslations = [...new Set([...translationsMissingButNotSent, ...newTranslations])];
  const nonTranslatedContent = combinedTranslations.filter(item => !translationsArray.includes(item));
  localStorage.setItem("beyondKitTranslationsMissing", JSON.stringify(nonTranslatedContent));

  checkIfHadPassed24HoursToSendMissingTranslations();
}

function sendMissingTranslations(translationsMissingButNotSent) {
  const translationsMissingAndSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissingAlreadySent") || '[]');

  const willSend = translationsMissingButNotSent.filter(item => !translationsMissingAndSent.includes(item));

  if (willSend.length > 20) {
    willSend.shift(); // Remove first element. First element is, in most times, the name of the character from the sheet.
    fetch('https://n8n.hotay.dev/webhook/dnd-beyond-kit-translation-new-translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(willSend),
    }).then(() => {
      localStorage.setItem("beyondKitTranslationsMissingAlreadySent", JSON.stringify([...new Set([...translationsMissingAndSent, ...translationsMissingButNotSent])]));
    }).catch((err) => {
      // On error we just don't execute/retry nothing. This error will not impact the user.
      console.log(err);
    });
  }
}

function checkIfHadPassed24HoursToSendMissingTranslations() {
  const lastUpdatedTime = parseInt(localStorage.getItem("beyondKitLastUpdatedTime") || "0");
  const savedArrayOfTranslations = JSON.parse(localStorage.getItem("beyondKitTranslationsArray") || "[]");

  // Check if the difference is greater than 24 hours (24 * 60 * 60 * 1000 ms)
  const timeDifference = Date.now() - lastUpdatedTime;
  const passedMoreThan24Hours = timeDifference > 24 * 60 * 60 * 1000;

  if (passedMoreThan24Hours) {
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

    // Each time the user access the extension, if it have passed more than 24 hours, we send the missing translations
    if (translationsMissingButNotSent.length > 20) {
      sendMissingTranslations(translationsMissingButNotSent)
    }
  } else {
    if (savedArrayOfTranslations.length > 0) {
      translationsArray = savedArrayOfTranslations;
    }
  }
}

// Start function, called when page loads
(() => {
  // After 5 seconds, we call our main function for this script
  setTimeout(async () => {
    await currentBrowser.storage.local.get("sendMissingTranslations").then((result) => {
      canSendMissingTranslations = result.sendMissingTranslations ?? false; // Deactivated by default
    });
  }, 5000);
})()