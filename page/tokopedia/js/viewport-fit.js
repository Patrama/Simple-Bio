(function () {
  const viewport = document.getElementById("viewport");
  const fitMain = document.getElementById("fitMain");
  const linksGrid = document.getElementById("linksGrid");
  const categoryTabs = document.getElementById("categoryTabs");

  if (!viewport || !fitMain) {
    return;
  }

  let frameId = 0;
  const minScale = 0.4;

  function fitPage() {
    frameId = 0;
    fitMain.style.setProperty("--page-scale", "1");

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const mainWidth = fitMain.scrollWidth;
    const mainHeight = fitMain.scrollHeight;

    if (!viewportWidth || !viewportHeight || !mainWidth || !mainHeight) {
      return;
    }

    const widthRatio = viewportWidth / mainWidth;
    const heightRatio = viewportHeight / mainHeight;
    const nextScale = Math.max(minScale, Math.min(1, widthRatio, heightRatio));

    fitMain.style.setProperty("--page-scale", String(nextScale));
  }

  function queueFit() {
    if (frameId) {
      return;
    }

    frameId = requestAnimationFrame(fitPage);
  }

  const observer = new MutationObserver(queueFit);
  if (linksGrid) {
    observer.observe(linksGrid, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if (categoryTabs) {
    observer.observe(categoryTabs, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(queueFit);
    resizeObserver.observe(fitMain);
  }

  window.addEventListener("resize", queueFit, { passive: true });
  window.addEventListener("orientationchange", queueFit, { passive: true });
  document.addEventListener("DOMContentLoaded", queueFit);
  window.addEventListener("load", queueFit);

  queueFit();
  setTimeout(queueFit, 120);
})();
