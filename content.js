chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'extractLinks') {
    // Retrieve the most recent stored link
    chrome.storage.local.get(['mostRecentFollower'], (result) => {
      let storedLink = result.mostRecentFollower || null;
      let dialogDiv = document.querySelector('div[role="dialog"]');
      let followersData = new Set();
      let foundStoredLink = false;

      console.log('Stored link:', storedLink);

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
            let followerData = JSON.stringify({
              username: cleanedUsername,
              link: fullLink
            });

            if (!followersData.has(followerData)) {
              followersData.add(followerData);
            }
          }
        }

        console.log(followersData);

        if (!foundStoredLink && followersData.size > 0) {
          let mostRecentFollowerLink = JSON.parse(Array.from(followersData)[0]);
          chrome.storage.local.set({ mostRecentFollower: mostRecentFollowerLink.link }, () => {
            console.log('Most recent follower link updated:', mostRecentFollowerLink.link);
          });
        } else if (followersData.size === 0) {
          console.log('No new links found. Stored link:', storedLink);
        }

      } else {
        console.error('Dialog box not found. Make sure it is open.');
      }

      const followersArray = Array.from(followersData).map(follower => JSON.parse(follower));
      sendResponse({ urls: followersArray });
    });
    return true; // Keeps the message channel open for asynchronous response
  }
});