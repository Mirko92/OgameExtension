import { 
    MP_PLANET_TYPES, 
    MP_MISSIONS 
} from './mp_consts';

/**
 * FleetDispatch page controller
 */
export class MpFleetDispatcher {

    myToken: null | string = null; 

    constructor() { }

    async init() {
        this._addQuickActionButtons();
        await this.refreshToken();
    }

    async refreshToken(){
        this.myToken = await this.getToken();
        console.debug("Token received", this.myToken);
    }

    async sendMessage(r: MpGetExpeditionConfig): Promise<any>;
    async sendMessage(r: MpSaveFleetInfo): Promise<void>;
    async sendMessage(r: MpGetFleetSave): Promise<FleetMission>;
    async sendMessage<T extends MpRequest>(request: T): Promise<MpResponse<T>> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                window.mp.extensionId,
                request,
                (response) => resolve(response)
            )
        })
    }

    async getToken() {
        return (await fetch(
            ogameUrl + "/game/index.php?page=ingame" + 
            "&component=fleetdispatch&action=checkTarget&ajax=1&asJson=1", 
            {
                method  : "POST",
                headers : { "x-requested-with": "XMLHttpRequest" },
                body    : new URLSearchParams({
                    token: this.myToken!,
                }).toString()
            }
        ))
        .json().then(x => x.newAjaxToken);
    }

    /**
     * Get planet/moon ID from document headers
     * @returns {string} Current planet/moon ID
     */
     _currentPlanetId() {
        return document.head
                .querySelector("[name=ogame-planet-id]")!
                .getAttribute("content")!;
    }

    get _currentPlanet(): Omit<Planet, 'id'|'name'|'fleetMission'> {
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
    
            const [galaxy, system, position] = coords.replace(/[\[\]]/g, "").split(':') as string[];
            const type: number = stringType === "planet" ? 1 : 3;

            return {
                galaxy, system, position, type
            }
        }
    }

    /**
     * Return a string collection, for each ship on the current planet
     */
     get _allShipsParmas(){
        return shipsOnPlanet.reduce((acc, val) => ({ 
                ...acc, 
                [`am${val.id}`]: val.number 
        }), {} );
    }

    /**
     * Add fleet buttons in the first step of fleetDispatcher 
    */
    _addQuickActionButtons() {
        const place = document.getElementById('continueToFleet2');

        if (place) {
            place?.insertAdjacentHTML('afterend', `
                <a  href="" 
                    id="fleet_save"
                    class="fright on" 
                    title="quick mission">
                </a>
                <a  href=""
                    id="exp_button" 
                    class="fright on" 
                    title="quick epxedition">
                </a>`
            );


            document.getElementById("fleet_save")
                ?.addEventListener('click', (e) => this.fleetSave(e));

            document.getElementById("exp_button")
                ?.addEventListener('click', (e) => this.sendExpedition(e));
        }
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

    /**
     * If configured, start fleet-save for current planet
     */
     async fleetSave(e?: Event, reload = true) {
        e?.preventDefault();

        const r = await this.sendMessage({
            method: "GET_FLEET_SAVE_DATA",
            data: {
                uni: window.mp.server, 
                planetId: this._currentPlanetId() 
            }
        })

        if (!r || Object.keys(r)?.length === 0) {
            fadeBox("Fleet save non configurato", true);
            return;
        }

        const body = new URLSearchParams({
            token  : this.myToken,      //fleetDispatcher.token,
            speed  : (+r.velocity!) / 10,
            mission: r.mission,
            //TO:
            galaxy  : r.galaxy,
            system  : r.system,
            position: r.position,
            type    : r.type,
            //HOLD:
            metal    : resourcesBar.resources.metal.amount,
            crystal  : resourcesBar.resources.crystal.amount,
            deuterium: resourcesBar.resources.deuterium.amount,

            prioMetal    : 1,
            prioCrystal  : 2,
            prioDeuterium: 3,

            retreatAfterDefenderRetreat: 0,
            union: 0,
            holdingtime: 0,

            //Ships
            ...this._allShipsParmas
        } as any).toString();

        await this.sendFleet(body);

        reload && location.reload();
    }

    /**
     * Send configured expedition mission
     */
    async sendExpedition(e?: Event, reload = true) {
        e?.preventDefault();

        const ships = await this.sendMessage({
            method: "GET_EXPEDITION_CONFIG",
            data: {
                uni: window.mp.server,
            }
        })

        if (!ships) {
            fadeBox("Spedizioni non configurate", true);
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
            ...ships
        }).toString();

        await this.sendFleet(body);

        reload && location.reload();
    }

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {any} planet Eg: 1_88_4_3
     */
    async saveFleetInfo(uni: string, planet: Planet, shipsData: any) {
        planet.id = this._currentPlanetId();

        return this.sendMessage({
            method: "SAVE_FLEET_INFO",
            data: {
                uni, 
                planet, 
                shipsData, 
                uniName: window.mp.uniName, 
                playerName 
            }
        })
    }

    async moveAllCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Partenza e destinazione uguali");
            return;
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        await this.sendFleet(this._allCargobody(
            galaxy, system, position, MP_PLANET_TYPES.PLANET, false
        ));

        location.reload()
    }

    async moveAllCargoToMoon() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.MOON) {
            console.warn("Partenza e destinazione uguali");
            return;
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        await this.sendFleet(this._allCargobody(
            galaxy, system, position, MP_PLANET_TYPES.MOON, true
        ))

        location.reload();
    }

    async moveSmallCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Partenza e destinazione uguali");
            return;
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        await this.sendFleet(this._smallCargobody(
            galaxy, system, position, MP_PLANET_TYPES.PLANET, false
        ));

        location.reload();
    }
    
    async moveCargoToPlanet() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.PLANET) {
            console.warn("Partenza e destinazione uguali");
            return;
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        await this.sendFleet(this._allCargobody(
            galaxy, system, position, MP_PLANET_TYPES.PLANET, false
        ))

        location.reload();
    }

    async moveSmallCargoToMoon() {
        if(this._currentPlanet.type === MP_PLANET_TYPES.MOON) {
            console.warn("Partenza e destinazione uguali");
            return;
        }; 

        const { galaxy, system, position } = this._currentPlanet;

        await this.sendFleet(this._smallCargobody(
            galaxy, system, position, MP_PLANET_TYPES.MOON, true
        ));

        location.reload();
    }

    async moveResourcesTo(destination: string) {
        const {galaxy, system, position, type} = window?.currentPlanet;
        const current = [galaxy, system, position, type].join(',');

        if(current === destination){
            console.warn("Partenza e destinazione uguali");
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
// TODO: amount backup deu 
        const currentDeuAmount = resourcesBar.resources.deuterium.amount;
        const deuToHold = currentDeuAmount > 10e6  ? currentDeuAmount - 10e6 : 0;

        const total = deuToHold + crystalOnPlanet + metalOnPlanet;

        const isEnoughLittleCargo   = littleCargo && total < littleCargo.cargoCapacity;
        const isEnoughLargeCargo    = largeCargo  && total < largeCargo.cargoCapacity;

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

        await this.sendFleet(body);
        
        location.reload();
    }

    async sendFleet(body: string) {
        let fleetUrl = ogameUrl + "/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1";
        let referrer = ogameUrl + "/game/index.php?page=ingame&component=fleetdispatch";

        return fetch(fleetUrl, {
            body,
            method: "POST",
            referrer,
            referrerPolicy: "strict-origin-when-cross-origin",
            credentials: "include",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
        });
    }
}