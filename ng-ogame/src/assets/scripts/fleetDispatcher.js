/**
 * TODO: work in progress. 
 */
export class MpFleetDispatcher {

    /**
     * Add fleet button in the first step of fleetDispatcher 
    */
    _addFleetButton() {
        document.getElementById('continueToFleet2')?.insertAdjacentHTML('afterend', `
            <a class="continue fright on" href="" onclick="this.runFleetSave(event)">
                <span>FLEET SAVE</span>
            </a>
        `);
    }

    runFleetSave(e) {
        e.preventDefault();

        chrome.runtime.sendMessage(this.extensionId(),
            {
                method: "GET_FLEET_SAVE_DATA",
                data: { uni: this.server(), planet: currentPlanet }
            },

            (r) => {
                console.debug("diocane", r);
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

    }
}