chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openListPopup") {
        chrome.action.openPopup().catch(err => console.error("Erreur ouverture popup :", err));
    }
});
