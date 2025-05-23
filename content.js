console.log("Content script loaded");
function getSearchQuery() {
  const input = document.querySelector('input[name="q"]');
  return input ? input.value : "";
}

function createResultDiv(query) {
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
  resultDiv.style.fontSize = "24px";
  resultDiv.style.fontWeight = "600";
  resultDiv.style.textAlign = "left";
  resultDiv.style.textTransform = "none";

  resultDiv.innerHTML = `
    <h3 style="margin-top: 0; font-weight: 600;"><strong>Reddit Search Result</strong></h3>
    <p>${query}</p>
  `;

  return resultDiv;
}

function insertSearchResultPanel() {
  const rhs = document.getElementById("rhs");
  const query = getSearchQuery();

  if (rhs && query) {
    const resultDiv = createResultDiv(query);
    rhs.prepend(resultDiv); // insert at top of RHS
  } else {
    // If RHS hasn't loaded yet, try again after short delay
    setTimeout(insertSearchResultPanel, 300);
  }
}

insertSearchResultPanel();