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
      saveFleetInfo(request.data, sendResponse);
      break;

    case "GET_FLEET_INFO":
      console.debug("Methdod, get fleet info", request.data);
      getFleetInfo(request.data.uni, sendResponse);
      return true;

    case "GET_FLEET_SAVE_DATA":
      console.debug("Methdod, get fleet save info", request.data);
      getFleetSave(request.data, sendResponse);
      return true;

    default:
      break;
  }
}

/**
 * Dati provenienti dal gioco 
 * ID dell'Universo es: s170-it 
 * Info Pianeta
 * Dati Navi su pianeta
 * @param {uni: string, planet: OgamePlanet, shipsData} data 
 */
function saveFleetInfo(data, callback) {
  const { uni, uniName, playerName, planet, shipsData } = data;

  chrome.storage.local.get(['ogameData'], function (storage) {
    const universes = storage?.ogameData || [];

    let uniData = universes.find(u => u.code === uni);
    if(!uniData){
      uniData = {
        code: uni, 
        name: uniName,
        playerName
      };
      universes.push(uniData);
    }

    const index = uniData?.planets?.findIndex(p => p.name === planet.name);
    const planetInMemory = uniData?.planets?.[index];
    const fleetMission = planet?.fleetMission || planetInMemory?.fleetMission || {};
    const update = {
      ...planet,
      shipsData,
      fleetMission
    };

    if (index === undefined || index === null || index === -1) {
      uniData.planets = [...(uniData?.planets || []), update];
    } else {
      uniData.planets[index] = update;
    }

    chrome.storage.local.set({ ogameData: universes });
    callback();
  });
}

function getFleetInfo(uni, callback) {
  chrome.storage.local.get(['ogameData'], function ({ogameData}) {
    callback(ogameData.find(u => u.code === uni));
  });
}

function getFleetSave(data, callback) {
  const { uni, planet } = data;

  chrome.storage.local.get(['ogameData'], function ({ogameData}) {
    const uniData = ogameData.find(u => u.code === uni);

    const found = uniData?.planets?.find(p => p.name === planet.name);

    callback(found.fleetMission);
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
