chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'extractLinks') {
    // Retrieve the most recent stored link
    chrome.storage.local.get(['mostRecentFollower'], (result) => {
      let storedLink = result.mostRecentFollower || null;
      let dialogDiv = document.querySelector('div[role="dialog"]');
      let uniqueUrls = new Set();
      let foundStoredLink = false;

      console.log('Stored link:', storedLink); // Debug

      if (dialogDiv) {
        let links = dialogDiv.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
          let href = links[i].getAttribute('href');

          if (href && href.includes('/')) {
            let fullLink = 'https://www.instagram.com' + href;
            console.log(fullLink);

            if (fullLink === storedLink) {
              foundStoredLink = true;
              break;
            }
            let cleanedUsername = href.replace(/[^a-zA-Z0-9]/g, '');
            uniqueUrls.add({
              username: cleanedUsername,
              link: fullLink
            });
            console.log(uniqueUrls)
          }
        }

        if (!foundStoredLink && uniqueUrls.size > 0) {
          let mostRecentFollowerLink = Array.from(uniqueUrls)[0];
          chrome.storage.local.set({ mostRecentFollower: mostRecentFollowerLink.link }, () => {
            console.log('Most recent follower link updated:', mostRecentFollowerLink.link);
          });
        } else if (uniqueUrls.size === 0) {
          console.log('No new links found. Stored link:', storedLink); // Debug
        }

        sendResponse({ urls: Array.from(uniqueUrls) });
      } else {
        console.error('Dialog box not found. Make sure it is open.');
      }
    });

    return true; // Keeps the message channel open for asynchronous response
  }
});
