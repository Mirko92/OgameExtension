const extensionName = "Ogame MP";

//#region Enable/Disable behavior

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
//#endregion

//#region Installed Evennt
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
//#endregion

//#region Storage logger for debugging purpose
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
//#endregion

//#region MESSAGES HANDLING
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onMessageExternal.addListener(handleMessage);

function handleMessage(request: any, sender: any, sendResponse: any) {
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

      case "GET_EXPEDITION_CONFIG":
        console.debug("Methdod: GET_EXPEDITION_CONFIG", request.data);
        getExpeditionConfig(request.data, sendResponse);
        return true;

      case "OPEN_OPTIONS":
        console.debug("Methdod: OPEN_OPTIONS");
        chrome.runtime.openOptionsPage();
        return true;

    default:
      sendResponse(false);
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
function saveFleetInfo(data: any, callback: Function) {
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
    let uniData = universes.find((u: any) => u.code === uni);
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
      ...(uniData.planets?.filter((p: any) => p.id !== planet.id) || []),
      {
        ...planet,
        shipsData
      }
    ];

    chrome.storage.local.set({ ogameData: universes });
    callback();
  });
}


function getFleetSave(data: any, callback: Function) {
  const { uni, planetId } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    const uniData = ogameData.find((u: any) => u.code === uni);

    const found = uniData?.missions?.find((m: any) =>
      m.planetId === planetId
    );

    callback(found);
  });
}


function saveMission(data: any, callback: Function) {
  const { uni, mission } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    let uniData = ogameData.find((u: any) => u.code === uni);

    // Update planets into universe
    uniData.missions = [
      ...(uniData.missions || [])?.filter((x: any) => x.planetId !== mission.planetId),
      mission
    ];

    chrome.storage.local.set({ ogameData: [...ogameData.filter((u: any) => u.code !== uni), uniData] });
    callback();
  });
}


function saveExpeditionMission(data: any, callback: Function) {
  const { uni, expeditionConfig } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    let uniData = ogameData.find((u: any) => u.code === uni);

    // Update expedition config 
    uniData.expeditionConfig = expeditionConfig;

    chrome.storage.local.set({ ogameData: [...ogameData.filter((u: any) => u.code !== uni), uniData] });
    callback();
  });
}

function getExpeditionConfig(data: any, callback: Function) {
  const { uni } = data;

  chrome.storage.local.get(['ogameData'], function ({ ogameData }) {
    callback(ogameData.find((u: any) => u.code === uni).expeditionConfig);
  });
}
//#endregion