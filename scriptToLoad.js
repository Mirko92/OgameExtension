window.mp = {
    extensionId(){
        return localStorage.getItem('mp_ogame_ext_id');
    },
    /**
     * Return server name 
     * Eg: s-170-it
     */
    server: function(){
        const url = location.href;
        return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(url)[1]
    },


    /**
     * Add fleet buttons next to every planet
     */
    addFleetActions(){
        console.debug("Aggiungo azioni ai pulsanti di fleet save");

        const fleetButtons = document.querySelectorAll('.mp_fleet_button');

        console.debug("Trovati " + fleetButtons.length + " pulsanti");

        fleetButtons.forEach(btn => btn.onclick = this.quickFleetSave);
    },

    /**
     * Create/Update in localstorage
     * info abount available ships on planet 
     * @param {string} uni Eg: s-170.it
     * @param {string} planet Eg: 1_88_4_3
     */
    updateFleetInfo(uni, planet, data){
        const uniData = JSON.parse(localStorage.getItem("mp_"+uni) || "{}");

        console.debug("UniData saved:", uniData);
        console.debug("Data to save:", data);

        uniData[planet] = {
            ...(uniData[planet] || {}),
            ...data
        };

        console.debug("After merge:", uniData);

        localStorage.setItem("mp_"+uni, JSON.stringify(uniData));

        chrome.runtime.sendMessage(this.extensionId, {["mp_"+uni] :uniData});
    },

    init: function () {
        console.debug("Init ogame extension");

        console.debug("Player name: ", player.name);

        console.debug("Current page: ", currentPage);


        switch (currentPage) {
            case "fleetdispatch":
                var {galaxy, system, position, type} = currentPlanet;
                var coords = galaxy + "_" + system + "_" + position + "_" + type;

                this.updateFleetInfo(this.server(), coords, shipsOnPlanet);
                break;

            default:
                break;
        }

        this.addFleetActions();

    },


    quickFleetSave(event){
        console.log("prova", event);

        fadeBox('Ci proviamo');
    },

    goToFleet() {
        window.location = 'index.php?page=ingame&component=fleetdispatch';
    },

    message(txt, isAlert) {
        fadeBox(txt, isAlert);
    }
}

window.onload = mp.init();