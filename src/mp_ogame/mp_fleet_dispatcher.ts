import { MpOgame } from '.';

import { 
    MP_PLANET_TYPES, 
    MP_MISSIONS 
} from './mp_consts';

declare const mp           : MpOgame;
declare const playerName   : string;
declare const ogameUrl     : string;
declare const resourcesBar : any;
declare const metalOnPlanet     : any;
declare const crystalOnPlanet   : any;
declare const deuteriumOnPlanet : any;
declare const shipsOnPlanet     : any;
declare function fadeBox(text: string, isAlert: boolean) : void;

type Ship = {
    id: number;
}

/**
 * FleetDispatch page controller
 */
export class MpFleetDispatcher {

    myToken = null; 

    constructor() { }

    async init() {
        this._addQuickActionButtons();
        await this.refreshToken();
    }

    async refreshToken(){
        this.myToken = await this.getToken();
        console.debug("Token received", this.myToken);
    }

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {any} planet Eg: 1_88_4_3
     */
    async saveFleetInfo(uni: string, planet: any, shipsData: any) {
        const uniName = document.title?.split(' ')[0];

        planet.id = this._currentPlanetId();

        return new Promise((resolve) => {
            chrome.runtime.sendMessage<any>(
                mp.extensionId as string,
                {
                    method: "SAVE_FLEET_INFO",
                    data: { uni, planet, shipsData, uniName, playerName }
                },
                resolve
            );
        });
    }

    async getToken() {
        let url = ogameUrl + "/game/index.php?page=ingame&component=fleetdispatch&action=checkTarget&ajax=1&asJson=1"

        const {
            galaxy,
            system,
            position,
            type,
        } = this._currentPlanet;

        const body = new URLSearchParams({
            galaxy,
            system,
            position,
            type,
            token: this.myToken,
            union: 0, 
        } as any).toString();

        const response = await fetch(
            url, 
            {
                mode: "cors",
                credentials: "same-origin",
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "accept-language": "it,it-IT;",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    cookie: document.cookie,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://s170-it.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch",
                referrerPolicy: "strict-origin-when-cross-origin",
                body
            }
        );

        return response.json().then(x => x.newAjaxToken );
    }

    get _currentPlanet() {
        if (window?.currentPlanet) {
            return window?.currentPlanet;
        } else {
            const metaTags = document.querySelectorAll("[name^=ogame-planet-]") as unknown as HTMLMetaElement[];

            const {
                ["ogame-planet-type"]: stringType,
                ["ogame-planet-coordinates"]: coords
            } = [...metaTags].reduce((a: any,x) => {
                a[x.name] = x.content;
                return a;
            }, {})
    
            const [galaxy, system, position] = coords.replace(/[\[\]]/g, "").split(':');
            const type = stringType === "planet" ? 1 : 3;

            return {
                galaxy, system, position, type
            }
        }
    }

    /**
     * Get planet/moon ID from document headers
     * @returns {string} Current planet/moon ID
     */
    _currentPlanetId() {
        return document.head
                .querySelector("[name=ogame-planet-id]")!
                .getAttribute("content");
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
     */
    quickAction(e: Event, reload = true) {
        e?.preventDefault();

        return new Promise((resolve) => {

            chrome.runtime.sendMessage(
                mp.extensionId as string,
                {
                    method: "GET_FLEET_SAVE_DATA",
                    data: { 
                        uni: mp.server, 
                        planetId: this._currentPlanetId() 
                    }
                },

                (r) => {
                    if (!r || Object.keys(r)?.length === 0) {
                        fadeBox("Fleet save non configurato", true);
                        resolve(false);
                        return;
                    }

                    const body = new URLSearchParams({
                        token: this.myToken,//fleetDispatcher.token,
                        speed: r.velocity / 10,
                        mission: r.mission,
                        //TO:
                        galaxy: r.galaxy,
                        system: r.system,
                        position: r.position,
                        type: r.type,
                        //HOLD:
                        metal    : resourcesBar.resources.metal.amount,
                        crystal  : resourcesBar.resources.crystal.amount,
                        deuterium: resourcesBar.resources.deuterium.amount,

                        prioMetal: 1,
                        prioCrystal: 2,
                        prioDeuterium: 3,

                        retreatAfterDefenderRetreat: 0,
                        union: 0,
                        holdingtime: 0,

                        //Ships
                        ...this._allShipsParmas
                    }).toString();

                    this.sendFleet(body).then(() => {
                        reload && location.reload();
                    }).finally(() => r());
                }
            );
        });

    }

    /**
     * Send configured expedition mission
     */
    sendExpedition(e: Event, reload = true) {
        e?.preventDefault();

        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                mp.extensionId as string,
                {
                    method: "GET_EXPEDITION_CONFIG",
                    data: { uni: mp.server }
                },

                (r) => {
                    const { ships } = r || {};
                    
                    if (!ships || ships?.length === 0) {
                        fadeBox("Spedizioni non configurate", true);
                        resolve(false);
                        return;
                    }
            
                    const body = new URLSearchParams({
                        token: this.myToken, //fleetDispatcher.token,
                        speed: 10,
                        mission: 15,
                        //TO:
                        galaxy: this._currentPlanet.galaxy,
                        system: this._currentPlanet.system,
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
                        ...[{}, ...ships].reduce(
                            (acc, val) => val?.id && { ...(acc || {}), [`am${val.id}`]: val.value }
                        )
                    }).toString();

                    this.sendFleet(body).then(() => {
                        reload && location.reload();
                    })
                        .finally(() => r());
            
                }
            );
        });
    }

    /**
     * Return a string collection, for each ship on the current planet
     */
    get _allShipsParmas(){
        return [{}, ...shipsOnPlanet].reduce(
            (acc, val) => val?.id && { ...(acc || {}), [`am${val.id}`]: val.number }
        );
    }

    _smallCargobody(galaxy: string, system: string, position: string, type: number, withResources: boolean){

        const lcargo = shipsOnPlanet.find((s: Ship) => s.id === 202)?.number;

        if ( !lcargo ) {
            console.error(`No cargo on planet ${galaxy}:${system}:${position}`);
        }

        return new URLSearchParams({
            token: this.myToken,//fleetDispatcher.token,
            speed: 10,
            mission: MP_MISSIONS.DEPLOY,
            //TO:
            galaxy,
            system,
            position,
            type,
            //HOLD:
            metal:      withResources ? metalOnPlanet.toFixed()     : 0,
            crystal:    withResources ? crystalOnPlanet.toFixed()   : 0,
            deuterium:  withResources ? deuteriumOnPlanet.toFixed() : 0,

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,

            am202: lcargo
        } as any).toString();
    }

    _allCargobody(galaxy: string, system: string, position: string, type: number, withResources: boolean){

        const [
            lcargo,
            bigCargo
        ] = [ 202, 203].map(
            id => shipsOnPlanet.find((s: Ship) => s.id === id)?.number
        );

        if ( !lcargo && !bigCargo ) {
            console.error(`No cargo on planet ${galaxy}:${system}:${position}`);
        }

        return new URLSearchParams({
            token: this.myToken,//fleetDispatcher.token,
            speed: 10,
            mission: MP_MISSIONS.DEPLOY,
            //TO:
            galaxy,
            system,
            position,
            type,
            //HOLD:
            metal:      withResources ? metalOnPlanet.toFixed()     : 0,
            crystal:    withResources ? crystalOnPlanet.toFixed()   : 0,
            deuterium:  withResources ? deuteriumOnPlanet.toFixed() : 0,

            prioMetal: 1,
            prioCrystal: 2,
            prioDeuterium: 3,

            am202: lcargo,
            am203: bigCargo
        } as any).toString();
    }

    async moveAllCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Mission lanciata da pianeta verso pianeta");
            return Promise.resolve(null);
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        return this.sendFleet(
            this._allCargobody(
                galaxy, system, position, MP_PLANET_TYPES.PLANET, false
            )
        ).then(() => location.reload());
    }

    async moveAllCargoToMoon() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.MOON) {
            console.warn("Mission lanciata da luna verso luna");
            return Promise.resolve(null);
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        return this.sendFleet(
            this._allCargobody(
                galaxy, system, position, MP_PLANET_TYPES.MOON, true
            )
        ).then(() => location.reload());
    }

    async moveSmallCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Mission lanciata da pianeta verso pianeta");
            return Promise.resolve(null);
        }; 

        const { galaxy, system, position } = this._currentPlanet;
        const body = this._smallCargobody(galaxy, system, position, MP_PLANET_TYPES.PLANET, false);

        return this.sendFleet(body).then(() => location.reload());
    }
    
    async moveCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Mission lanciata da pianeta verso pianeta");
            return Promise.resolve(null);
        }; 

        const { galaxy, system, position } = this._currentPlanet;
        const body = this._allCargobody(galaxy, system, position, MP_PLANET_TYPES.PLANET, false);

        return this.sendFleet(body).then(() => location.reload());
    }

    async moveSmallCargoToMoon() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.MOON) {
            console.warn("Mission lanciata da luna verso luna");
            return Promise.resolve(null);
        }; 

        const { galaxy, system, position } = this._currentPlanet;
        const body = this._smallCargobody(galaxy, system, position, MP_PLANET_TYPES.MOON, true);

        return this.sendFleet(body).then(() => location.reload());
    }

    async moveResourcesTo(destination: string) {
        const {galaxy, system, position, type} = window?.currentPlanet;
        const current = [galaxy, system, position, type].join(',');

        if(current === destination){
            console.warn("Partenza e destinazione sono uguali");
            return Promise.resolve(null);
        }

        if ( (metalOnPlanet + crystalOnPlanet) === 0 ) {
            console.warn("Nessuna risorsa in " + current);
            return;
        }
        
        const littleCargo = shipsOnPlanet.find((s: Ship) => s.id === 202);
        const largeCargo  = shipsOnPlanet.find((s: Ship) => s.id === 203);
        
        if( !littleCargo && !largeCargo ) {
            console.warn("Nessun cargo in " + current);
            return;
        }

        const [destG,destS, destP,destT] = destination.split(',');

        const currentDeuAmount = resourcesBar.resources.deuterium.amount;
        const deuToHold = currentDeuAmount > 10e6  ? currentDeuAmount - 10e6 : 0;

        const total = deuToHold + crystalOnPlanet + metalOnPlanet;

        const isEnoughLittleCargo   = total < littleCargo?.cargoCapacity;
        const isEnoughLargeCargo    = total < largeCargo?.cargoCapacity;

        let shipsToSend = null;
        if ( isEnoughLittleCargo ) {
            shipsToSend = { am202: Math.floor(total / littleCargo.baseCargoCapacity) + 10 }
        } else if ( isEnoughLargeCargo ) {
            shipsToSend = { am203: Math.floor(total / largeCargo.baseCargoCapacity) + 10 }
        } else {
            shipsToSend = { am203: largeCargo?.number || 0, am202: littleCargo?.number || 0 }
        }

        
        const body = new URLSearchParams({
            token: this.myToken, //fleetDispatcher.token,
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
            ...shipsToSend
        } as any).toString();

        return this.sendFleet(body).then(() => location.reload());
    }

    sendFleet(body: string) {
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