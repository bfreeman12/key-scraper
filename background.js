chrome.runtime.onMessage.addListener((message, sender) => {
  const { event } = message;
  switch (event) {
    case "getKeys":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
          const url = new URL(tabs[0].url);
          let contentScript;

          if (url.hostname === "www.fanatical.com") {
            contentScript = "fanaticalContent.js";
          } else if (url.hostname === "www.humblebundle.com") {
            contentScript = "humbleContent.js";
          } else {
            console.log("Unsupported website");
            return;
          }

          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: [contentScript],
          });
        } else {
          console.log("No active tabs found");
        }
      });
      break;
    default:
      break;
  }
});
