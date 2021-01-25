/**
 * TODO: work in progress. 
 */
export class MpFleetDispatcher {

    /**
     * Add quick actio button in the first step of fleetDispatcher 
     * And Expedition button
    */
    addQuickActionButtons() {
        document
            .getElementById('continueToFleet2')
            ?.insertAdjacentHTML('afterend', `
            <a  href="" 
                id="quick_action"
                class="fright on" 
                title="quick mission"
                onclick="mp.quickAction(event)">
            </a>
            <a  href=""
                id="exp_button" 
                class="fright on" 
                title="quick epxedition"
                onclick="mp.sendExpedition(event)">
            </a>
        `);
    }

    /**
     * If configured, start configured quick mission for current planet
     * TODO: Change name to "quickMission"
     */
    quickAction(e, reload = true) {
        e?.preventDefault();

        return new Promise((resolve) => {

            chrome.runtime.sendMessage(this.extensionId(),
                {
                    method: "GET_FLEET_SAVE_DATA",
                    data: { uni: this.server(), planet: currentPlanet }
                },

                (r) => {
                    if (!r || Object.keys(r)?.length === 0) {
                        this.message("Fleet save non configurato", true);
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
                    }).finally(() => resolve());
                }
            );
        });

    },
}