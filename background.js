console.log("Background script loaded");

// Generate Userless Token
async function fetchUserlessToken(clientId) {
  const url = "https://www.reddit.com/api/v1/access_token";
  let deviceId = "DO_NOT_TRACK_THIS_DEVICE";

  const body = new URLSearchParams({
    grant_type: "https://oauth.reddit.com/grants/installed_client",
    device_id: deviceId
  });

  const headers = {
    "Authorization": "Basic " + btoa(`${clientId}:`),
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Search Extension/1.0 by u/Funny-Top-3709"
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`Token fetch failed: ${response.status}`);
  }

  const json = await response.json();
  return json.access_token;
}

// Listen to messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_REDDIT_TOKEN") {
    const clientId = message.clientId;
    fetchUserlessToken(clientId)
      .then(token => sendResponse({ token }))
      .catch(err => sendResponse({ error: err.message }));
    return true; // Indicate async response
  }
});