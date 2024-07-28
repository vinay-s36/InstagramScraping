document.getElementById('extractLinksButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'extractLinks' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error: ", chrome.runtime.lastError.message);
          document.getElementById('output').innerHTML = 'Error: Unable to communicate with the content script.';
          return;
        }

        if (response && response.urls) {
          displayLinks(response.urls);
        } else {
          document.getElementById('output').innerHTML = 'No links found or an error occurred.';
        }
      });
    }
  });
});

function displayLinks(urls) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';
  if (urls.length > 0) {
    urls.forEach((url) => {
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.target = '_blank';
      linkElement.textContent = url;
      outputDiv.appendChild(linkElement);
      outputDiv.appendChild(document.createElement('br'));
    });
  } else {
    outputDiv.innerHTML = 'No links found.';
  }
}

