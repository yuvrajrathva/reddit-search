console.log("Background script loaded");

chrome.tabs.onActivated.addListener((tab) => {
  console.log("Tab activated:", tab);
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var title = document.getElementById("editpane_title").value;
    alert(title);
  });
});
