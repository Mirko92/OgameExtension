import {
    MP_PLANET_TYPES,
    MP_LOCAL_STORAGE,
} from './consts.js';

// Controllers
import { MpFleetDispatcher } from './fleetDispatcher.js';
import { MpGalaxy } from './galaxy.js';

window.mp = {
    galaxy: null,
    fleetDispatcher: null,

    /**
     * Extracts server code from web url 
     */
    server: () => new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1],

    /**
     * Return chrome extension id 
     */
    extensionId: () => localStorage.getItem('mp_ogame_ext_id'),

    /**
     * Lista degli ID dei pianeti del giocatore
     * Lune comprese
     */
    planetIds() {
        return [...document.querySelectorAll('a.planetlink, a.moonlink')].map(l => {

            let url = l.getAttribute("href");

            var searchParams = new URLSearchParams(url);

            return searchParams.get('cp');

        });
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

    async automaticFleetSave(mission) {
        console.log("AutomaticFleetSave");
        if (mission) {

            if (currentPage === 'fleetdispatch') {
                await this.fleetDispatcher.quickAction(null, false);
            }

            if (mission.planetList?.length) {
                const planetId = mission.planetList.pop();
                localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
                location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetdispatch`);
            } else {
                this.clearMissions()
            }

        } else {
            mission = { code: 'fleet-save' };

            mission.planetList = this.planetIds();

            localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
            location.reload();
        }

    },

    updateFleets(mission) {
        if (mission) {
            if (mission.planetList?.length) {
                const planetId = mission.planetList.pop();
                localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));

                setTimeout(() => {
                    location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetdispatch`);
                }, 200);
            } else {
                this.clearMissions()
            }

        } else {
            mission = { code: 'update-fleets' };

            mission.planetList = this.planetIds();

            localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
            location.reload();
        }
    },

    async moveToPlanet(mission) {
        if (mission) {

            if (currentPage === 'fleetdispatch') {
                await this.fleetDispatcher.moveSmallCargoToPlanet();
            }

            if (mission.planetList?.length) {
                const planetId = mission.planetList.pop();
                localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
                location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetdispatch`);
            } else {
                this.clearMissions()
            }

        } else {
            mission = { code: 'move-to-planet' };

            mission.planetList = this.planetIds();

            localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
            location.reload();
        }
    },

    async moveToMoon(mission) {
        if (mission) {

            if (currentPage === 'fleetdispatch') {
                await this.fleetDispatcher.moveSmallCargoToMoon();
            }

            if (mission.planetList?.length) {
                const planetId = mission.planetList.pop();
                localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
                location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetdispatch`);
            } else {
                this.clearMissions()
            }

        } else {
            mission = { code: 'move-to-moon' };

            mission.planetList = this.planetIds();

            localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
            location.reload();
        }
    },

    async collectToMain(mission, destination) {
        if (mission) {

            if (currentPage === 'fleetdispatch') {
                await this.fleetDispatcher.moveSmallCargoTo(mission.destination);
            }

            if (mission.planetList?.length) {
                const planetId = mission.planetList.pop();
                localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
                location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=fleetdispatch`);
            } else {
                this.clearMissions()
            }

        } else {
            mission = { code: 'collect-to-main', destination };

            mission.planetList = this.planetIds();

            localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
            location.reload();
        }
    },

    //#region KEEP_ME_ON
    _prepareKeepMeOn(delay) {
        const next_exe = delay && (new Date().valueOf() + delay) ;

        let mission = {
            code: 'keep-me-on',
            next_exe
        };

        mission.planetList = this.planetIds();

        localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
        location.reload();
    },

    _randomMinutes() {
        return (Math.floor(Math.random() * 4) + 3) * 1000 * 60;
    },

    _execKeepMeOn(mission) {
        if (mission.planetList?.length) {
            const planetId = mission.planetList.pop();

            this.setMission(mission);

            location.replace(`https://${this.server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}`);
        } else {
            this.clearMissions();
            this._prepareKeepMeOn(this._randomMinutes());
        }
    },

    keepMeOn(mission) {
        if (mission) {
            const now = new Date().valueOf();

            if (!mission.next_exe || mission.next_exe < now) {
                this._execKeepMeOn(mission);
            } else {
                const diff = mission.next_exe - now ;
                setTimeout(() => {
                    this._execKeepMeOn(mission);
                }, diff);
            }

        } else {
            this._prepareKeepMeOn(null);
        }
    },
    //#endregion

    setMission(mission) {
        localStorage.setItem(MP_LOCAL_STORAGE.MISSION, JSON.stringify(mission));
    },

    clearMissions() {
        localStorage.removeItem(MP_LOCAL_STORAGE.MISSION);
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
                this.automaticFleetSave(mission);
                break;

            case "update-fleets":
                this.updateFleets(mission);
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

            case "keep-me-on":
                this.keepMeOn(mission);
                break;

            default:
                break;
        }
    },

    init: async function () {
        console.debug("Init ogame extension");
        console.debug("Player name: ", player.name);
        console.debug("Current page: ", currentPage);

        switch (currentPage) {
            case "fleetdispatch":
                this.fleetDispatcher = new MpFleetDispatcher();
                this.fleetDispatcher.init();
                await this.fleetDispatcher.saveFleetInfo(this.server(), currentPlanet, shipsOnPlanet);
                break;

            case "galaxy":
                this.galaxy = new MpGalaxy();
                this.galaxy.init();
                break;
            default:
                break;
        }

        this.todo();
    },

}

window.onload = mp.init();