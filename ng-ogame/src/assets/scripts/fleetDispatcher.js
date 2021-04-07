import { MP_PLANET_TYPES, MP_MISSIONS } from './consts.js';
/**
 * FleetDispatch page controller
 */
export class MpFleetDispatcher {

    constructor() { }

    init() {
        this._addQuickActionButtons();
    }

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {string} planet Eg: 1_88_4_3
     */
    async saveFleetInfo(uni, planet, shipsData) {
        const uniName = document.title?.split(' ')[0];

        planet.id = this._currentPlanetId();

        return new Promise((resolve) => {
            chrome.runtime.sendMessage(mp.extensionId(),
                {
                    method: "SAVE_FLEET_INFO",
                    data: { uni, planet, shipsData, uniName, playerName }
                },
                resolve
            );
        });
    }

    _currentPlanetId() {
        let result = null;

        if (currentPlanet.type === MP_PLANET_TYPES.MOON) {
            const currentMoonEl = document.querySelector(".hightlightMoon a.moonlink");
            const moonUrl = currentMoonEl.getAttribute("href");

            var searchParams = new URLSearchParams(moonUrl);
            result = searchParams.get('cp');
        } else {
            const currentPlanetEl = document.querySelector(".hightlightPlanet");
            result = currentPlanetEl.getAttribute('id').replace("planet-", "");
        }

        if (result) {
            return result;
        } else {
            throw "Current planet id not found";
        }

    }

    /**
     * Add fleet buttons in the first step of fleetDispatcher 
    */
    _addQuickActionButtons() {
        const place = document.getElementById('continueToFleet2');

        if (place) {
            place?.insertAdjacentHTML('afterend', `
            <a  href="" 
                id="quick_action"
                class="fright on" 
                title="quick mission">
            </a>
            <a  href=""
                id="exp_button" 
                class="fright on" 
                title="quick epxedition">
            </a>`);


            document.getElementById("quick_action")
                ?.addEventListener('click', (e) => this.quickAction(e));

            document.getElementById("exp_button")
                ?.addEventListener('click', (e) => this.sendExpedition(e));
        }
    }

    /**
     * If configured, start configured quick mission for current planet
     * TODO: Change name to "quickMission"
     */
    quickAction(e, reload = true) {
        e?.preventDefault();

        return new Promise((resolve) => {

            chrome.runtime.sendMessage(mp.extensionId(),
                {
                    method: "GET_FLEET_SAVE_DATA",
                    data: { uni: mp.server(), planetId: this._currentPlanetId() }
                },

                (r) => {
                    if (!r || Object.keys(r)?.length === 0) {
                        mp.message("Fleet save non configurato", true);
                        resolve(false);
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

                    this.sendFleet(body).then(() => {
                        reload && location.reload();
                    })
                        .finally(() => resolve());
                }
            );
        });

    }

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
            { id: 218, number: 1 },   //Reaper
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

        this.sendFleet(body)
            .then(() => location.reload());
    }

    async moveSmallCargoToPlanet() {
        if(currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Mission lanciata da pianeta verso pianeta");
            return Promise.resolve(null);
        }; 

        const number = shipsOnPlanet.find(s => s.id === 202)?.number;

        if(!number){
            return Promise.resolve(null);
        }

        const body = new URLSearchParams({
            token: fleetDispatcher.fleetSendingToken,
            speed: 10,
            mission: MP_MISSIONS.DEPLOY,
            //TO:
            galaxy: currentPlanet.galaxy,
            system: currentPlanet.system,
            position: currentPlanet.position,
            type: 1,
            //HOLD:
            metal: 0,
            crystal: 0,
            deuterium: 0,

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,

            am202: number
        }).toString();

        return this.sendFleet(body).then(() => location.reload());
    }

    moveSmallCargoToMoon() {
        if(currentPlanet.type === MP_PLANET_TYPES.MOON) {
            console.warn("Mission lanciata da luna verso luna");
            return Promise.resolve(null);
        }; 

        const number = shipsOnPlanet.find(s => s.id === 202)?.number;

        if(!number){
            return Promise.resolve(null);
        }

        const body = new URLSearchParams({
            token: fleetDispatcher.fleetSendingToken,
            speed: 10,
            mission: MP_MISSIONS.DEPLOY,
            //TO:
            galaxy: currentPlanet.galaxy,
            system: currentPlanet.system,
            position: currentPlanet.position,
            type: MP_PLANET_TYPES.MOON,
            //HOLD:
            metal: resourcesBar.resources.metal.amount.toFixed(),
            crystal: resourcesBar.resources.crystal.amount.toFixed(),
            deuterium: resourcesBar.resources.deuterium.amount.toFixed(),

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,


            //Ships
            am202: number
        }).toString();

        return this.sendFleet(body).then(() => location.reload());
    }

    moveSmallCargoTo(destination) {
        const {galaxy, system, position, type} = currentPlanet;
        const current = [galaxy, system, position, type].join(',');

        if(current === destination){
            console.warn("Partenza e destinazione sono uguali");
            return Promise.resolve(null);
        }

        console.debug("destination");
        const [destG,destS, destP,destT] = destination.split(',');

        const number = shipsOnPlanet.find(s => s.id === 202)?.number;

        if(!number){
            return Promise.resolve(null);
        }

        const currentDeuAmount = resourcesBar.resources.deuterium.amount;
        const deuToHold = currentDeuAmount > 5e6  ? currentDeuAmount - 5e6 : 0;

        const body = new URLSearchParams({
            token: fleetDispatcher.fleetSendingToken,
            speed: 10,
            mission: MP_MISSIONS.TRANSPORT,
            //TO:
            galaxy: destG,
            system: destS,
            position: destP,
            type: destT,
            //HOLD:
            metal: resourcesBar.resources.metal.amount,
            crystal: resourcesBar.resources.crystal.amount,
            deuterium: deuToHold,

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,

            //Ships
            am202: number
        }).toString();

        return this.sendFleet(body).then(() => location.reload());
    }

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
    }
}