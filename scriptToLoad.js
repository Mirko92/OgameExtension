// TODO: Trovare un modo per caricarlo, ultimo aggiornamento 11.02 del 8 Dic. 2020

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

window.mp = {
    server: () => String,

    extensionId() {
        return localStorage.getItem('mp_ogame_ext_id');
    },

    fleetToken(){
        return localStorage.getItem('mp_fleet_token');
    },

    /**
     * Add fleet buttons next to every planet
     */
    addFleetActions() {
        console.debug("Aggiungo azioni ai pulsanti di fleet save");

        const fleetButtons = document.querySelectorAll('.mp_fleet_button');

        console.debug("Trovati " + fleetButtons.length + " pulsanti");

        fleetButtons.forEach(btn => btn.onclick = this.quickFleetSave);
    },

    /**
     * Run configured fleet save from the selected planet 
     * TODO: ...
     * @param {event} event 
     */
    quickFleetSave(event) {
        const planet = this.getAttribute('data-planet');
        const moon = this.getAttribute('data-moon');

        const missionParams = new URLSearchParams({
            token: this.fleetToken,
            speed:10,
            mission: MP_MISSIONS.TRANSPORT,
            //TO:
            galaxy: 1,
            system: 299,
            position: 6,
            type: MP_PLANET_TYPES.MOON,
            //HOLD:
            metal:1000,
            crystal:0,
            deuterium:0,

            prioMetal:1,
            prioCrystal:2,
            prioDeuterium:3,

            retreatAfterDefenderRetreat:0,
            union:0,
            holdingtime:0,

            //Ships
            am203:1,
        }).toString();

        let fleetUrl = ogameUrl+"/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1";

        fetch(fleetUrl, {
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
            "referrer": fleetUrl,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": missionParams,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(x => {
            x.json().then(body => {
                const response = body.response;
                fadeBox(response.message, !response.success);
                miniFleetToken = body.newToken;
            })
        });
    },

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {string} planet Eg: 1_88_4_3
     */
    saveFleetInfo(uni, planet, shipsData) {
        chrome.runtime.sendMessage(this.extensionId,
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
                // TODO: Gestione local storage in file a parte 
                localStorage.setItem('mp_fleet_token', fleetDispatcher.fleetSendingToken);
                this.saveFleetInfo(this.server, currentPlanet, shipsOnPlanet);
                break;
            default:
                break;
        }

        this.addFleetActions();

    }
}

window.onload = mp.init();