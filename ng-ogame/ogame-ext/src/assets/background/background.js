chrome.runtime.onInstalled.addListener(function () {
  console.debug("Extension installed");

  /**
   * Check if tab is running ogame inside 
   */
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (/https:\/\/s\d\d\d-\D\D.ogame.gameforge.*/.test(tab.url)) {
      console.debug("Tab is running ogame");
    }
  });

  /*  
    Enable extension for 'ogame.gameforges' host only
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

/**
 * Storage changes logger
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.debug(
      'Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);
  }
});

//#region MESSAGES HANDLING
console.debug("#######################################");
console.debug("Adding message listener");

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onMessageExternal.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  console.debug("Request:", request);

  console.debug(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");

  switch (request.method) {
    case "SAVE_FLEET_INFO":
      console.debug("Methdod, save fleet info", request.data);
      saveFleetInfo(request.data);
      break;

    case "GET_FLEET_INFO":
      console.debug("Methdod, get fleet info", request.data);
      getFleetInfo(request.data.uni, sendResponse);
      return true;

    default:
      break;
  }
}

function saveFleetInfo(data) {
  const { uni, planet, shipsData } = data;


  chrome.storage.local.get([uni], function (result) {
    const value = (result[uni] || {});
    console.debug('Value currently is ', value);

    const { galaxy, system, position, type } = planet;
    const coords = galaxy + "_" + system + "_" + position + "_" + type;

    console.debug("Updating coords:", coords);

    value[coords] = {
      ...(value[coords] || {}),
      shipsData
    };

    chrome.storage.local.set({ [uni]: value }, function () {
      console.log('Value is set to ' + value);
    });
  });
}

function getFleetInfo(uni, callback) {
  chrome.storage.local.get([uni], function (result) {
    callback(result[uni]);
  });
}

console.debug("#######################################");
//#endregion


/*

  var {galaxy, system, position, type} = currentPlanet;
  var coords = galaxy + "_" + system + "_" + position + "_" + type;

  console.debug("UniData saved:", uniData);
  console.debug("Data to save:", data);

  uniData[planet] = {
      ...(uniData[planet] || {}),
      ...data
  };

  console.debug("After merge:", uniData);

*/
