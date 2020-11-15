chrome.runtime.onInstalled.addListener(function () {

  console.debug("Estensione installata");

  currentTabId = null; 

  /* 
    TODO: Prova storage 
  */
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });

  // FIXME: Cancellare 
  chrome.tabs.onSelectionChanged.addListener(function(tabId) {
    // lastTabId = tabId;
    // chrome.pageAction.show(lastTabId);
    currentTabId = tabId;
    console.debug("Current tab ID:", currentTabId);

    // Cambia il testo dell tooltip
    // chrome.pageAction.setTitle({title: "Bubala", tabId: currentTabId});
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
          pageUrl: { urlContains: 'ogame.gameforges' },
        })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction(),
      ]
    }
  ]);


});