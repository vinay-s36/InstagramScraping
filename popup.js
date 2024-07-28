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

async function displayLinks(followersData) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  if (followersData.length > 0) {
    try {
      const response = await fetch('http://localhost:5000/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(followersData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      outputDiv.innerHTML = 'New followers data added successfully.';
      console.log('Success:', data);
    } catch (error) {
      outputDiv.innerHTML = 'An error occurred while adding followers data.';
      console.error('Error:', error);
    }
  } else {
    outputDiv.innerHTML = 'No new followers found.';
  }
}