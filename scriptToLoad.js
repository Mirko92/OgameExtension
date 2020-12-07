window.mp = {
    server: () => String,

    extensionId() {
        return localStorage.getItem('mp_ogame_ext_id');
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
        console.console.debug("prova", event);
        fadeBox('Ci proviamo');
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
                this.saveFleetInfo(this.server, currentPlanet, shipsOnPlanet);
                break;
            default:
                break;
        }

        this.addFleetActions();

    }
}

window.onload = mp.init();