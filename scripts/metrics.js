async function needToChangeMetrics() {
  return await chrome.storage.local.get("convertUnits").then((result) => {
    return result.convertUnits ?? true;
  });
}

const elementsWithSeparatedValueAndUnit = [
  "section.ct-speed-box .ct-speed-box__box-value span",
  ".ddbc-combat-attack__range .ddbc-combat-attack__range-value span",
  ".ct-spells-spell__range .ct-spells-spell__range-value span"
];

// TODO: Convert also: lb, miles, inches, cubic foots, square yards, pounds, onces and gallons

const feetToMeters = (feet) => feet * 0.3;
const feetRegex = /\b(\d+(\.\d+)?)\s*(feet|foot|ft|-ft|ft\.)\b/gi;

function replaceFeetsByMetersInText(element) {
  if (element.nodeType === Node.TEXT_NODE) {
    if (feetRegex.test(element.textContent)) {
      element.textContent = element.textContent.replace(feetRegex, function (match, feetValue) {
        try {
          var metersValue = feetToMeters(parseFloat(feetValue));
          return (metersValue % 1 === 0 ? metersValue.toFixed(0) : metersValue.toFixed(1)) + ' m';
        } catch (error) {
          console.error(error);
          return match;
        }
      });
    }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    element.childNodes.forEach((element) => replaceFeetsByMetersInText(element))
  }
}

function replaceFeetsByMetersInSpecialAreas() {
  elementsWithSeparatedValueAndUnit.forEach((element) => _replaceFeetsByMetersInSpecialAreas(element));
}

function _replaceFeetsByMetersInSpecialAreas(element) {
  const elm = typeof element == 'string' ? document.querySelectorAll(element) : element;
  if (!elm) return;

  elm.forEach((singleElement) => {
    if (!singleElement.attributes?.translated) {
      if (singleElement.nodeType !== Node.TEXT_NODE) singleElement.setAttribute('translated', "true");

      if (singleElement.nodeType === Node.TEXT_NODE) {
        if (singleElement.textContent && !singleElement.attributes?.translated) {
          if (parseInt(singleElement.textContent)) {
            // number
            const metersValue = feetToMeters(parseFloat(singleElement.textContent));
            singleElement.textContent = (metersValue % 1 === 0 ? metersValue.toFixed(0) : metersValue.toFixed(1));
          } else {
            // text
            if (singleElement.textContent !== "(" && singleElement.textContent !== ")") {
              singleElement.textContent = "m"
            }
          }
        }
      } else if (singleElement.nodeType === Node.ELEMENT_NODE) {
        _replaceFeetsByMetersInSpecialAreas(singleElement.childNodes)
      }
    }
  });
}

async function run() {
  const needToRun = await needToChangeMetrics();
  if (!needToRun) {
    console.log("Metrics convert is disabled");
  } else {
    var observedNode = document.body;
    const observerOptions = {
      childList: true,    // Observe additions and removals of child nodes
      attributes: false,  // Observe changes to attributes
      subtree: true       // Observe changes to all descendants
    };
    const observer = new MutationObserver((mutationsList, _observer) => {
      mutationsList.forEach(mutation => {
        replaceFeetsByMetersInSpecialAreas();
        replaceFeetsByMetersInText(mutation.target);
      });
    });
    observer.observe(observedNode, observerOptions);
  }
}

async function runWhenPageReady() {
  if (document.querySelector("body")) {
    await run();
  } else {
    setTimeout(runWhenPageReady, 500);
  }
}

(async () => {
  await runWhenPageReady();
})()
