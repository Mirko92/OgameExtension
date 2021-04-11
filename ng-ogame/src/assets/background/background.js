chrome.runtime.onInstalled.addListener(function () {
  console.debug("Extension installed");
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
/**
   * Check if tab is running ogame inside 
   */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (/https:\/\/s\d\d\d-\D\D.ogame.gameforge.*/.test(tab.url)) {
    console.debug("Tab is running ogame");
  }
});

/**
 * Storage changes logger
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.debug(
      'Storage key "%s" in namespace "%s" changed. ', key, namespace);
    console.debug("Old value was", storageChange.oldValue);
    console.debug("New value is", storageChange.newValue);
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
      console.debug("Methdod: SAVE_FLEET_INFO", request.data);
      saveFleetInfo(request.data, sendResponse);
      break;

    case "GET_FLEET_SAVE_DATA":
      console.debug("Methdod: GET_FLEET_SAVE_DATA", request.data);
      getFleetSave(request.data, sendResponse);
      return true;

    case "SAVE_MISSION":
      console.debug("Methdod: SAVE_MISSION", request.data);
      saveMission(request.data, sendResponse);
      return true;

    case "SAVE_EXPEDITION_CONFIG":
      console.debug("Methdod: SAVE_EXPEDITION_CONFIG", request.data);
      saveExpeditionMission(request.data, sendResponse);
      return true;

    default:
      break;
  }
}

/**
 * Datas from OG.  
 * Universe ID eg: s170-it 
 * Player's NickName 
 * Planet info
 * Ships on the planet
 * @param {uni: string, playerName: string, planet: OgamePlanet, shipsData} data 
 */
function saveFleetInfo(data, callback) {
  const {
    uni,
    uniName,
    playerName,
    planet,
    shipsData
  } = data;


  chrome.storage.local.get(['ogameData'], function (storage) {
    // Update universes
    const universes = storage?.ogameData || [];
    let uniData = universes.find(u => u.code === uni);
    if (!uniData) {
      uniData = {
        code: uni,
        name: uniName,
        playerName
      };

      universes.push(uniData);
    }

    // Update planets into universe
    uniData.planets = [
      ...(uniData.planets?.filter(p => p.id !== planet.id) || []),
      {
        ...planet,
        shipsData
      }
    ];

    chrome.storage.local.set({ ogameData: universes });
    callback();
  });
}


function getFleetSave(data, callback) {
  const { uni, planetId } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    const uniData = ogameData.find(u => u.code === uni);

    const found = uniData?.missions?.find(m =>
      m.planetId === planetId
    );

    callback(found);
  });
}


function saveMission(data, callback) {
  const { uni, mission } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    let uniData = ogameData.find(u => u.code === uni);

    // Update planets into universe
    uniData.missions = [
      ...(uniData.missions || [])?.filter(x => x.planetId !== mission.planetId),
      mission
    ];

    chrome.storage.local.set({ ogameData: [...ogameData.filter(u => u.code !== uni), uniData] });
    callback();
  });
}


function saveExpeditionMission(data, callback){
  const { uni, expeditionConfig } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    let uniData = ogameData.find(u => u.code === uni);

    // Update expedition config 
    uniData.expeditionConfig = expeditionConfig;

    chrome.storage.local.set({ ogameData: [...ogameData.filter(u => u.code !== uni), uniData] });
    callback();
  });
}

console.debug("#######################################");
//#endregion
