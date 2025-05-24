console.log("Content script loaded");

function getSearchQuery() {
  const input = document.querySelector('input[name="q"]');
  return input ? input.value : "";
}

function createResultDiv(content) {
  const resultDiv = document.createElement("div");
  resultDiv.style.marginTop = "20px";
  resultDiv.style.marginBottom = "20px";
  resultDiv.style.padding = "15px";
  resultDiv.style.background = "#F24523";
  resultDiv.style.color = "#FFFFFF";
  resultDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  resultDiv.style.border = "1px solid #c3dafe";
  resultDiv.style.borderRadius = "8px";
  resultDiv.style.width = "500px";
  resultDiv.style.height = "auto";
  resultDiv.style.boxSizing = "border-box";
  resultDiv.style.fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';
  // resultDiv.style.fontSize = "24px";
  // resultDiv.style.fontWeight = "600";
  resultDiv.style.textAlign = "left";
  resultDiv.style.textTransform = "none";

  resultDiv.innerHTML = `
    <h3 style="margin-top: 0; font-weight: 600;"><strong>Reddit Search Result</strong></h3>
    <div>${content}</div>
  `;

  return resultDiv;
}

function limitText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function createContent(query, posts) {
  let content = `<strong>Search Query:</strong> ${query}<br><br>`;
  if (!posts || posts.length === 0) {
    content += "No results found.";
    return content;
  }
  content += "<strong>Top Reddit Posts:</strong><br><br>";
  posts.forEach((post, index) => {
    content += `<strong>${index + 1}. ${post.data.title}</strong>`;
    content += `<p>${limitText(post.data.selftext, 100)}</p>`;
    content += `<i>Score: ${post.data.score}</i><br>`;
    content += `<br>`;
  });
  return content;
}

async function searchReddit(query, token) {
  const response = await fetch(
    `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Search Extension/1.0 by u/Funny-Top-3709",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Reddit search failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("Search results data:", data);
  return data.data.children;
}

async function insertSearchResultPanel() {
  const rhs = document.getElementById("rhs");
  const query = getSearchQuery();
  const clientId = "D3rbtK6r83m8CigKazmHNw";

  if (rhs && query) {
    try {
      const { token, error } = await chrome.runtime.sendMessage({
        type: "GET_REDDIT_TOKEN",
        clientId,
      });
      if (error) {
        throw new Error(`Failed to get Reddit token: ${error}`);
      }

      const posts = await searchReddit(query, token);
      console.log("Reddit posts:", posts);
      const content = createContent(query, posts);
      const resultDiv = createResultDiv(content);
      rhs.prepend(resultDiv);
    } catch (err) {
      console.error("Reddit fetch failed:", err);
    }
  } else {
    // If RHS hasn't loaded yet, try again after short delay
    setTimeout(insertSearchResultPanel, 300);
  }
}

insertSearchResultPanel();
