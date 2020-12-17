const MP_MISSIONS = {
    ATTACK: 1,
    UNIONATTACK: 2,
    TRANSPORT: 3,
    DEPLOY: 4,
    HOLD: 5,
    ESPIONAGE: 6,
    COLONIZE: 7,
    RECYCLE: 8,
    DESTROY: 9,
    MISSILEATTACK: 10,
    EXPEDITION: 15
};

const MP_PLANET_TYPES = {
    PLANET: 1,
    DEBRIS: 2,
    MOON: 3
};

const MP_LOCAL_STORAGE = {
    FLEET_TOKEN: "mp_fleet_token"
};

window.mp = {
    server: () => new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1],

    extensionId: () => localStorage.getItem('mp_ogame_ext_id'),

    fleetToken: () => localStorage.getItem('mp_fleet_token'),

    /**
     * Add fleet button in the first step of fleetDispatcher 
    */
    addFleetButton() {
        const continueButton = document.querySelector('#continueToFleet2');
        continueButton.insertAdjacentHTML('afterend', '<a class="continue fright on" href="" onclick="mp.runFleetSave(event)"><span>FLEET SAVE</span></a>')
    },

    runFleetSave(e) {
        e.preventDefault();

        chrome.runtime.sendMessage(this.extensionId(),
            {
                method: "GET_FLEET_SAVE_DATA",
                data: { uni: this.server(), planet: currentPlanet }
            },

            (r) => {
                if (!r) return;

                const body = new URLSearchParams({
                    token: fleetDispatcher.fleetSendingToken,
                    speed: r.velocity,
                    mission: r.mission,
                    //TO:
                    galaxy: r.galaxy,
                    system: r.system,
                    position: r.position,
                    type: r.type,
                    //HOLD:
                    metal: resourcesBar.resources.metal.amount,
                    crystal: resourcesBar.resources.crystal.amount,
                    deuterium: resourcesBar.resources.deuterium.amount,

                    prioMetal: 1,
                    prioCrystal: 2,
                    prioDeuterium: 3,

                    retreatAfterDefenderRetreat: 0,
                    union: 0,
                    holdingtime: 0,

                    //Ships
                    ...[{}, ...shipsOnPlanet].reduce(
                        (acc, val) => val?.id && { ...(acc || {}), [`am${val.id}`]: val.number }
                    )
                }).toString();

                this.sendFleet(body).then(() => location.reload());
            }
        )

    },

    sendFleet(body) {
        let fleetUrl = ogameUrl + "/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1";
        let referrer = ogameUrl + "/game/index.php?page=ingame&component=fleetdispatch";

        return fetch(fleetUrl, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "it,it-IT;q=0.9,en;q=0.8,en-US;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": referrer,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": body,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
    },

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {string} planet Eg: 1_88_4_3
     */
    saveFleetInfo(uni, planet, shipsData) {
        chrome.runtime.sendMessage(this.extensionId(),
            {
                method: "SAVE_FLEET_INFO",
                data: { uni, planet, shipsData }
            }
        );
    },

    goToFleet() {
        window.location = 'index.php?page=ingame&component=fleetdispatch';
    },

    message(txt, isAlert) {
        fadeBox(txt, isAlert);
    },

    init: function () {
        console.debug("Init ogame extension");
        console.debug("Player name: ", player.name);
        console.debug("Current page: ", currentPage);

        switch (currentPage) {
            case "fleetdispatch":
                this.addFleetButton();
                // TODO: Gestione local storage in file a parte 
                localStorage.setItem(MP_LOCAL_STORAGE.FLEET_TOKEN, fleetDispatcher.fleetSendingToken);
                this.saveFleetInfo(this.server(), currentPlanet, shipsOnPlanet);
                break;
            default:
                break;
        }

        // this.addFleetActions();

    }
}

window.onload = mp.init();