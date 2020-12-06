console.debug("#######################################");
console.debug("Adding OnInstalled Listener");

chrome.runtime.onInstalled.addListener(function () {
  console.debug("Estensione installata");

  /* 
    TODO: Prova storage 
  */
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (/https:\/\/s\d\d\d-\D\D.ogame.gameforge.*/.test(tab.url)) {
      console.debug("Tab is running ogame");
    }
  });



  /*  
    L'estensione sarà utilizzabile 
    solo in pagine che contengono 
    'ogame.gameforges' nell' url
  */
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'ogame.gameforge' },
        })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction(),
      ]
    }
  ]);
});


//#region MESSAGES HANDLING
console.debug("#######################################");
console.debug("Adding onMessageExternal listener");

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        console.debug("Request:", request);
        
        if (request.greeting == "hello")
            sendResponse({ farewell: "goodbye" });
    }
);
//#endregion

