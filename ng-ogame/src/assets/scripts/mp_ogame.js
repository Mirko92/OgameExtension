import {
    MP_MISSIONS,
    MP_PLANET_TYPES,
    MP_LOCAL_STORAGE,
    MP_BOT_MISSIONS
} from './consts.js';

import { MpGalaxy } from './galaxy.js';

window.mp = {
    galaxy: null,

    /**
     * Extracts server code from web url 
     */
    server: () => new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1],

    /**
     * Return chrome extension id 
     */
    extensionId: () => localStorage.getItem('mp_ogame_ext_id'),

    /**
     * @DEPRECATED 
     */
    fleetToken: () => localStorage.getItem('mp_fleet_token'),

    /**
     * Add fleet buttons in the first step of fleetDispatcher 
    */
    addQuickActionButtons() {
        document.getElementById('continueToFleet2')?.insertAdjacentHTML('afterend', `
            <a  href="" 
                id="quick_action"
                class="fright on" 
                title="quick mission"
                onclick="mp.runFleetSave(event)">
            </a>
            <a  href=""
                id="exp_button" 
                class="fright on" 
                title="quick epxedition"
                onclick="mp.sendExpedition(event)">
            </a>
        `);
    },

    addMenuButtons() {
        document
            .querySelector("#menuTable li:last-child")
            .insertAdjacentHTML(
                "afterend",
                `<li>
                    <span class="menu_icon">
                        <span class="menuImage"></span>
                    </span>
                    <a  class="menubutton" 
                        href="javascript:void(0);"
                        onclick="mp.automaticFleetSave()">
                        <span class="textlabel">Fleet save</span>
                    </a>
                </li>`
            );
    },

    /**
     * Send configured expedition mission
     * TODO: "Configuration UI" is missing 
     */
    sendExpedition(e) {
        e.preventDefault();

        const expSheeps = [
            { id: 203, number: 200 }, //Cargoni
            { id: 219, number: 1 },   //Path
            { id: 210, number: 1 },   //Sonda
            { id: 215, number: 1 },   //BC
        ]

        const body = new URLSearchParams({
            token: fleetDispatcher.fleetSendingToken,
            speed: 10,
            mission: 15,
            //TO:
            galaxy: currentPlanet.galaxy,
            system: currentPlanet.system,
            position: 16,
            type: 1,
            //HOLD:
            metal: 0,
            crystal: 0,
            deuterium: 0,

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,

            retreatAfterDefenderRetreat: 0,
            union: 0,
            holdingtime: 1,

            //Ships
            ...[{}, ...expSheeps].reduce(
                (acc, val) => val?.id && { ...(acc || {}), [`am${val.id}`]: val.number }
            )
        }).toString();

        this.sendFleet(body).then(() => location.reload());
    },

    /**
     * If configured, start configured quick mission for current planet
     * TODO: Change name to "quickMission"
     */
    runFleetSave(e) {
        e.preventDefault();

        chrome.runtime.sendMessage(this.extensionId(),
            {
                method: "GET_FLEET_SAVE_DATA",
                data: { uni: this.server(), planet: currentPlanet }
            },

            (r) => {
                if (!r || Object.keys(r)?.length === 0) {
                    this.message("Fleet save non configurato", true);
                    return;
                }

                const body = new URLSearchParams({
                    token: fleetDispatcher.fleetSendingToken,
                    speed: r.velocity / 10,
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

    /**
     * Perform HTTP request to send a fleet 
     */
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
     * Automacit espionage of inactives player in the current System 
     * NB: It works on Galaxy view only 
     */
    runInactiveEspionage() {
        console.debug("Run inactive espionage fn");
        let delay = 0;
        let step = 1000;

        return new Promise((resolve) => {
            let completed = 0;
            const elements = document.querySelectorAll('#galaxytable tr.inactive_filter td.action a.espionage');

            if (!elements?.length) resolve();

            elements.forEach(
                x => {
                    setTimeout(() => {
                        x.click();
                        completed++;

                        if (completed === elements.length) {
                            console.debug("Inactive espionage in this system completed");
                            resolve(true);
                        }
                    }, delay);

                    delay += step;
                }
            );
        });
    },

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {string} planet Eg: 1_88_4_3
     */
    saveFleetInfo(uni, planet, shipsData) {
        const uniName = document.title?.split(' ')[0];
        chrome.runtime.sendMessage(this.extensionId(),
            {
                method: "SAVE_FLEET_INFO",
                data: { uni, planet, shipsData, uniName, playerName }
            }
        );
    },

    /**
     * Navigate to Fleet Dispactch view
     */
    goToFleet() {
        window.location = 'index.php?page=ingame&component=fleetdispatch';
    },

    /**
     * Wrapper function of fadeBox(),
     * show a message to the user 
     * @param {String} txt 
     * @param {Boolean} isAlert 
     */
    message(txt, isAlert) {
        fadeBox(txt, isAlert);
    },

    missionGalaxy() {
        if (currentPage !== 'galaxy') {
            if (!mission.coords) return;

            const [g, s, p] = mission.coords;
            showGalaxy(g, s, p);
            return; //showGalaxy performs a navigation. 
        } else {
            var checkExist = setInterval(function () {
                if (document.getElementById('galaxy-content')) {
                    clearInterval(checkExist);

                    this.runInactiveEspionage()
                        .then(respose => {
                            showGalaxy(+galaxy, +system + 1, 1);
                        });
                }
            }, 100);
        }
    },

    automaticFleetSave(mission) {
        if (mission) {
            var searchParams = new URLSearchParams(window.location.search);
            const currentPlanetId = searchParams.get('cp');

        } else {
            const newMission = {code: 'fleet-save'};

            newMission.planetList = [
                {id = "33625478"},{id = "33633806"},
                {id = "33624616"},
                {id = "33625926"},{id = "33645639"},
                {id = "33622735"},{id = "33630136"},
                {id = "33636325"},{id = "33636399"},
                {id = "33630273"},{id = "33640684"},
                {id = "33627350"},{id = "33640680"},
                {id = "33633276"},{id = "33641906"},
                {id = "33650550"},{id = "33644930"},
                {id = "33644623"},{id = "33644930"},
            ]


            // localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(newMission));
            window.location.replace(`https://s170-it.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetDispatch`)
        }
    },

    todo: function () {
        const mission = JSON.parse(localStorage.getItem(MP_LOCAL_STORAGE.MISSION));

        if (!mission) return;

        if (mission.time) {
            // TODO: Controllare quando andrà eseguita la prossima fase
            return;
        }

        switch (mission.code) {
            case "galaxy":
                this.missionGalaxy();
                break;

            case "fleet-save":
                this.automaticFleetSave();
                break;
            default:
                break;
        }

        if (mission.code.startsWith('galaxy')) {


        }
    },

    init: function () {
        console.debug("Init ogame extension");
        console.debug("Player name: ", player.name);
        console.debug("Current page: ", currentPage);

        this.todo();

        this.addMenuButtons();

        switch (currentPage) {
            case "fleetdispatch":
                this.addQuickActionButtons();
                localStorage.setItem(MP_LOCAL_STORAGE.FLEET_TOKEN, fleetDispatcher.fleetSendingToken);
                this.saveFleetInfo(this.server(), currentPlanet, shipsOnPlanet);
                break;

            case "galaxy":
                this.galaxy = new MpGalaxy();
                this.galaxy.init();
                break;
            default:
                break;
        }
    },

}

window.onload = mp.init();