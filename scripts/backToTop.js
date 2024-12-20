// `currentBrowser` is defined in ./metrics.js

(() => {
  let scrollShown = false;
  let scroller;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function checkScroll() {
    if (window.scrollY >= 500 && !scrollShown) {
      showScroll();
    } else if (window.scrollY < 500 && scrollShown) {
      hideScroll();
    }
  }

  function showScroll() {
    document.body.appendChild(scroller);
    scrollShown = true;
  }

  function hideScroll() {
    scroller.remove();
    scrollShown = false;
  }

  window.addEventListener('scroll', checkScroll);
  scroller = document.createElement('button');
  scroller.innerText = currentBrowser.i18n.getMessage("backToTop");
  scroller.classList.add('scrollToTop');

  scroller.addEventListener('click', scrollToTop);

  checkScroll();
})()