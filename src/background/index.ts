const extensionName = "Ogame MP";

/**
 * Extension start disabled by default
 */
chrome.action.disable();

/**
 * On tab change check if the url matches with the ogame url
 * If it does, enable the extension
 * If it doesn't, disable the extension
 */
chrome.tabs.onActivated.addListener(async function (tabInfo) {
  console.debug("TabInfo", tabInfo);

  const tab = (await chrome.tabs.query({
    active: true,
  }))[0];

  if (/https:\/\/s\d\d\d-\D\D.ogame.gameforge.*/.test(tab.url!)) {
    console.debug("Tab is running ogame");
    chrome.action.enable();
    // TODO: Change ICON
  } else {
    console.debug("Tab is not running ogame");
    chrome.action.disable(tabInfo.tabId);
    // TODO: Change ICON
  }
});

// Example to change icon dynamically
// function imageData() {
//   const canvas = new OffscreenCanvas(16, 16);

//   const context = canvas.getContext('2d');
//   context.clearRect(0, 0, 16, 16);
//   context.fillStyle = '#00FF00';  // Green
//   context.fillRect(0, 0, 16, 16);
  
//   return context.getImageData(0, 0, 16, 16);
// }

const rules: chrome.events.Rule[] = [
  {
    id: 'page_action',
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { 
          schemes: [ 'https' ],
          urlContains: 'ogame.gameforge' 
        },
      })
    ],
    actions: [
      chrome.declarativeContent.ShowAction 
        ? new chrome.declarativeContent.ShowAction()
        : new chrome.declarativeContent.ShowPageAction(),
      
        // new chrome.declarativeContent.SetIcon({
        //   imageData: imageData()
        // })
    ],
  }
]

chrome.runtime.onInstalled.addListener(function() {
  console.log(`${extensionName}: Extension installed`)

  chrome.declarativeContent.onPageChanged.removeRules(
    [ "page_action" ], 
    function() {
      console.log(`${extensionName}: Rules removed`);

      chrome.declarativeContent.onPageChanged.addRules(
        rules,
        () => console.log(`${extensionName}: Rules updated`)
      );
    }
  );

});

// import { sendMessage, onMessage } from 'webext-bridge'
// let previousTabId = 0

// // communication example: send previous tab title from background page
// // see shim.d.ts for type decleration
// chrome.tabs.onActivated.addListener(async({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }
//   const tab = await chrome.tabs.get(previousTabId)
//   previousTabId = tabId
//   if (!tab)
//     return

//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })

// onMessage('get-current-tab', async() => {
//   try {
//     const tab = await chrome.tabs.get(previousTabId)
//     return {
//       title: tab?.id,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
