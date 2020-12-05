window.mp = {
    init: function () {
        console.debug("Init ogame extension");

        console.debug("Player name: ", player.name);

        console.debug("Current page: ", currentPage);


        switch (currentPage) {
            case "fleetdispatch":
                // TODO: Distinct by Coords and planet type
                localStorage.setItem('mp_fleet', shipsData);
                break;

            default:
                break;
        }

        this.addFleetActions();

    },

    addFleetActions(){
        console.debug("Aggiungo azioni ai pulsanti di fleet save");

        const fleetButtons = document.querySelectorAll('.mp_fleet_button');

        console.debug("Trovati " + fleetButtons.length + " pulsanti");

        fleetButtons.forEach(btn => btn.onclick = this.quickFleetSave);
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