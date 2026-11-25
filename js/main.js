(() => {
  "use strict";

  // Keep the existing HTML paths working on the GitHub Pages project site.
  document.querySelectorAll('img[src^="assets/"]').forEach((image) => {
    image.src = new URL(image.getAttribute("src").replace(/^assets\//, ""), document.baseURI).href;
  });

  const appScript = document.createElement("script");
  appScript.src = new URL("../main.js", document.currentScript.src).href;
  appScript.defer = true;
  document.head.append(appScript);
})();
