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

/**
 * Return all saved Universes data
 */
function getUniverses(): Promise<Universe[]> {
  return new Promise<Universe[]>((resolve, reject) => {
    chrome.storage.local.get('ogameData', 
      function ({ ogameData }: OgameStorage) {
        resolve(ogameData || []);
      }
    )
  })
}

function updateUniverses(universes: Universe[], uni: Universe) {
  return [...universes.filter(u => u.code !== uni.code), uni ] 
}

/**
 * Return a specific universe by code
 */
async function getUniverse(uni: string): Promise<Universe> {
  return (await getUniverses()).find(u => u.code === uni)!
}

/**
 * Return {universe, uniData}
 * All universe and a specific universe
 */
async function getUniversesAndUni(uni: string){
  const universes = await getUniverses()
  const uniData   = universes.find((u) => u.code === uni)!

  return {
    universes, uniData
  }
}

function handleMessage(
  request: MpRequest, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void ) {

  console.debug("Request:", request);

  console.debug(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");

  console.debug(`Method: ${request.method}`, request.data);

  switch (request.method) {
    case "SAVE_FLEET_INFO":
      saveFleetInfo(request.data, sendResponse);
      break;

    case "SAVE_FLEETSAVE_MISSION":
      saveFleetsaveMission(request.data, sendResponse);
      break;

    case "SAVE_MANY_FLEETSAVE_MISSIONS":
      saveManyFleetsaveMissions(request.data, sendResponse);
      break;

    case "GET_FLEET_SAVE_DATA":
      getFleetSave(request.data, sendResponse);
      break

    case "SAVE_MISSION":
      saveMission(request.data, sendResponse);
      break

    case "SAVE_EXPEDITION_CONFIG":
      saveExpeditionMission(request.data, sendResponse);
      break

    case "SAVE_SETTINGS":
      saveSettings(request.data, sendResponse);
      break

    case "GET_EXPEDITION_CONFIG":
      getExpeditionConfig(request.data, sendResponse);
      break

    case "OPEN_OPTIONS":
      chrome.runtime.openOptionsPage();
      break

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
 */
async function saveFleetInfo(data: MpSaveFleetInfoData, callback: Function) {
  const { uni, uniName, playerName, planet, shipsData = [] } = data;

  let { universes, uniData } = await getUniversesAndUni(uni)

  if (!uniData) {
    uniData = {
      code: uni,
      name: uniName,
      playerName,
      planets: [],
      expeditionConfig: {},
      settings: {
        deuReserve: 1000,
        displayBanner: false,
        displayGfBar: false,
      }
    };

    universes.push(uniData);
  }

  const idx = uniData.planets?.findIndex(p => p.id === planet.id)

  // Update planets into universe
  uniData.planets = [
    ...(uniData.planets?.filter(p => p.id !== planet.id) || []),
    {
      ...planet,
      ...(idx !== -1 ? uniData.planets[idx] : { fleetMission: {} }),
      shipsData,
    }
  ];

  chrome.storage.local.set({ ogameData: updateUniverses(universes, uniData) });
  callback();
}

async function getFleetSave({ uni, planetId }: MpPlanetKeys, callback: Function) {
  callback(
    (await getUniverse(uni))
      .planets
        .find(p => p.id === planetId)
        ?.fleetMission
  );
}

async function saveFleetsaveMission(
    { uni, planetId, mission }: MpPlanetMissionData, 
    callback: Function
  ) {
  const {universes, uniData} = await getUniversesAndUni(uni)

  uniData.planets
    .find(p => p.id === planetId)!
    .fleetMission = mission;

  await chrome.storage.local.set({ ogameData: updateUniverses(universes, uniData) })
  callback();
}

async function saveManyFleetsaveMissions({ uni, planets }: MpSaveManyFleetMissionsData, callback: Function) {
  const {universes, uniData} = await getUniversesAndUni(uni)

  planets.forEach(({planetId, mission}) => {
    uniData.planets.find(p => p.id === planetId)!.fleetMission = mission;
  });

  await chrome.storage.local.set({ ogameData: updateUniverses(universes, uniData) });
  callback();
}

async function saveMission({ uni, mission }: MpSaveMissionData, callback: Function) {
  const {universes, uniData} = await getUniversesAndUni(uni)

  // Update planets into universe
  uniData.missions = [
    ...(uniData.missions || [])?.filter(m => m.planetId !== mission.planetId),
    mission
  ];

  await chrome.storage.local.set({ ogameData: updateUniverses(universes, uniData) });
  callback();
}


async function saveExpeditionMission({ uni, expeditionConfig }: MpSaveExpeditionConfigData, callback: Function) {
  const {universes, uniData} = await getUniversesAndUni(uni)

  // Update expedition config 
  uniData.expeditionConfig = expeditionConfig;

  await chrome.storage.local.set({ ogameData: updateUniverses(universes, uniData) });
  callback();
}

async function getExpeditionConfig({ uni }: MpUniKey, callback: Function) {
  callback((await getUniverse(uni))?.expeditionConfig);
}

async function saveSettings({ settings }: MpSaveSettingsData, callback: Function) {
  const universes = await getUniverses();

  // Update settings 
  settings.forEach(s => {
    const u = universes.find(u => u.code === s.uni);

    if (u) { 
      u.settings = {
        deuReserve: s.deuReserve,
        displayBanner: s.displayBanner,
        displayGfBar: s.displayGfBar,
      };
    }
  });

  await chrome.storage.local.set({ ogameData: universes });
  callback();
}
//#endregion



// Example to change icon dynamically
// function imageData() {
//   const canvas = new OffscreenCanvas(16, 16);

//   const context = canvas.getContext('2d');
//   context.clearRect(0, 0, 16, 16);
//   context.fillStyle = '#00FF00';  // Green
//   context.fillRect(0, 0, 16, 16);
  
//   return context.getImageData(0, 0, 16, 16);
// }