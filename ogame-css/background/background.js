chrome.runtime.onInstalled.addListener(function () {
  console.debug("Estensione installata");

  /* 
    TODO: Prova storage 
  */
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.debug("Tab updated", chrome);

    if (/https:\/\/s\d\d\d-\D\D.ogame.gameforge.*/.test(tab.url)) {
      console.debug("Tab is running ogame");
      // chrome.tabs.executeScript({
      //   code: 'document.body.style.backgroundColor="orange"'
      // });
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
          pageUrl: { urlContains: 'ogame.gameforges' },
        })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction(),
      ]
    }
  ]);
});


