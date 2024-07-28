document.getElementById('extractLinksButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js']
        },
        () => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { message: 'extractLinks' },
            (response) => {
              if (response && response.urls) {
                displayLinks(response.urls);
              } else {
                console.log('No new followers found.');
              }
            }
          );
        }
      );
    }
  });
});

function displayLinks(urls) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  if (urls.length > 0) {
    outputDiv.innerHTML = 'New followers data added successfully.';
  } else {
    outputDiv.innerHTML = 'No new followers found.';
  }
}
