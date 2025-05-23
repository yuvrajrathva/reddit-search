console.log("Content script loaded");
function getSearchQuery() {
  const input = document.querySelector('input[name="q"]');
  return input ? input.value : "";
}

function createSidebar(query) {
  const sidebar = document.createElement("div");
  sidebar.style.position = "fixed";
  sidebar.style.top = "100px";
  sidebar.style.right = "10px";
  sidebar.style.width = "500px";
  sidebar.style.height = "auto";
  sidebar.style.padding = "15px";
  sidebar.style.background = "#f9f9f9";
  sidebar.style.color = "#333";
  sidebar.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  sidebar.style.zIndex = "9999";
  sidebar.style.fontSize = "16px";
  sidebar.style.fontFamily = "Arial, sans-serif";

  sidebar.textContent = `${query}`;

  document.body.appendChild(sidebar);
}

const query = getSearchQuery();
if (query) {
  createSidebar(query);
}
