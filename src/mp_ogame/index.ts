import { MP_LOCAL_STORAGE } from "./mp_consts";
import { MpFleetDispatcher } from "./mp_fleet_dispatcher";
import { MpGalaxy } from "./mp_galaxy";
import { MpMessageDataCollector } from "./mp_statistics";
import { MpTrader } from "./mp_trader";
import { extensionId, goTo, planetIds, server } from "./mp_utils";

declare const currentPage: string;
declare const player: { name: string};
declare const currentPlanet: any;
declare const shipsOnPlanet: any;


export class MpOgame {
    galaxy         : any = null;
    fleetDispatcher?: MpFleetDispatcher;
    trader?: MpTrader;

    get server() {
        return server();
    }

    get uniName() {
        return document.title?.split(' ')[0];
    }

    get extensionId() {
        return extensionId() as string;
    }

    get planetIds() {
        return planetIds();
    }

    getMission() {
        return JSON.parse(
            localStorage.getItem(MP_LOCAL_STORAGE.MISSION) || 'null'
        );
    }

    setMission<T extends Mission>(mission: T) {
        localStorage.setItem(
            MP_LOCAL_STORAGE.MISSION, 
            JSON.stringify(mission)
        );
    }

    /**
     * Stop running mission clearing local storage
     */
    clearMissions() {
        console.log("[MpOgame] - ClearMissions");
        localStorage.removeItem(MP_LOCAL_STORAGE.MISSION);
    }

    private async execute(mission: Mission, fleetCommand: Function) {
        if (currentPage === 'fleetdispatch') {
            await fleetCommand();
        }

        if (mission.planetList?.length) {
            this.next(mission);
        } else {
            this.clearMissions()
        }
    }

    private next(mission: Mission) {
        const planetId = mission.planetList.pop()!;
        this.setMission(mission);
        goTo(planetId, 'fleetdispatch');
    }

    async automaticFleetSave(mission?: Mission) {
        console.debug("[MpOgame] - AutomaticFleetSave");

        if (mission) {
            this.execute( mission, 
                () => this.fleetDispatcher?.quickAction(undefined, false)
            );
        } else {
            this.setMission({
                code: 'fleet-save',
                planetList: this.planetIds
            });

            location.reload();
        }
    }

    async moveToPlanet(mission?: Mission) {
        console.debug("[MpOgame] - MoveToPlanet");

        if (mission) {
            this.execute( mission, 
                () => this.fleetDispatcher?.moveAllCargoToPlanet()
            );
        } else {
            this.setMission({ 
                code: 'move-to-planet',
                planetList: this.planetIds
            });

            location.reload();
        }
    }

    async moveToMoon(mission?: Mission) {
        console.debug("[MpOgame] - MoveToMoon");

        if (mission) {
            this.execute( mission, 
                () => this.fleetDispatcher?.moveAllCargoToMoon()
            );
        } else {
            this.setMission({ 
                code: 'move-to-moon',
                planetList: this.planetIds
            })

            location.reload();
        }
    }

    // TODO: Change name to "collectTo"
    async collectToMain(mission?: CollectMission, destination?: string) {
        console.debug("[MpOgame] - CollectToMain");

        if (mission) {
            this.execute( mission, 
                () => this.fleetDispatcher?.moveResourcesTo(mission.destination)
            );
        } else if (destination) {
            this.setMission({
                code: 'collect-to-main', 
                destination,
                planetList: this.planetIds
            })

            location.reload();
        }
    }

    todo() {
        const mission = this.getMission();

        if (!mission) return;

        switch (mission.code) {

            case "fleet-save":
                this.automaticFleetSave(mission);
                break;

            case "move-to-planet":
                this.moveToPlanet(mission);
                break;

            case "move-to-moon":
                this.moveToMoon(mission);
                break;

            case "collect-to-main":
                this.collectToMain(mission);
                break;

            default:
                break;
        }
    }

    //#region INJECTION VUE APP 
    private loadVueApp() {
        const div = document.createElement('div');
        div.setAttribute('id', 'content_app');
        document.body.appendChild(div);
        
        // Load Vue AppJS Script 
        const vueScript = document.createElement("script") as HTMLScriptElement;
        vueScript.setAttribute('type', "module");
        vueScript.src = `chrome-extension://${this.extensionId}/dist/assets/content_app.js`;
        vueScript.defer = true;
        document.body.append(vueScript);
    }
    //#endregion

    async init() {
        console.debug("[MpOgame] - Init ogame extension");
        console.debug("[MpOgame] - Player name: ", player.name);
        console.debug("[MpOgame] - Current page: ", currentPage);

        const attackAlert = document.querySelector('#attack_alert');
        if (!attackAlert?.classList.contains('noAttack')) return;
        
        this.loadVueApp();
        /**
         * Con l'aggiornamento alla versione 8 
         * il token per l'invio della flotta viene richiesto tramite apposita chiamata
         * (vedi getToken()). 
         * Questa chiamata al momento sembra funzionare anche da riepilogo.
         * Perciò, per le missioni che richiedono un numero prestabilito di navi, 
         * è possibile evitare il cambio pagina.
         */
        this.fleetDispatcher = new MpFleetDispatcher();
        await this.fleetDispatcher.init();
        
        switch (currentPage) {
            case 'messages': 
                const s = new MpMessageDataCollector();
                s.init();
                break;

            case "fleetdispatch":
                // this.fleetDispatcher = new MpFleetDispatcher();
                // await this.fleetDispatcher.init();
                await this.fleetDispatcher.saveFleetInfo(
                    this.server, 
                    currentPlanet, 
                    shipsOnPlanet
                );
                break;

            case "galaxy":
                this.galaxy = new MpGalaxy();
                this.galaxy.init();
                break;

            case "traderOverview":
                this.trader = new MpTrader();
                break;
            default:
                break;
        }

        this.todo();
    }
}

const mp = new MpOgame();
window.mp = mp; 
window.onload = () => mp.init();