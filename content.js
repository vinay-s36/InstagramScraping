chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'extractLinks') {
    let dialogDiv = document.querySelector('div[role="dialog"]');
    let uniqueUrls = new Set();

    if (dialogDiv) {
      let links = dialogDiv.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        let href = links[i].getAttribute('href');
        if (href && href.includes('/')) {
          uniqueUrls.add('https://www.instagram.com' + href);
        }
      }
    }

    sendResponse({ urls: Array.from(uniqueUrls) });
  }
  return true;
});
