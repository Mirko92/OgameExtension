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

        this.addFleetsButton();

    },

    addFleetsButton() {
        const planets = document.querySelectorAll('#planetList > div');

        planets.forEach(p => {
            p.appendChild(this.fleetButton());
        });
    },

    fleetButton() {
        let button = document.createElement('button');
        button.textContent = "FS(m)";
        button.classList = ['mp_fleet_button'];
        return button;
    },

    goToFleet() {
        window.location = 'index.php?page=ingame&component=fleetdispatch';
    },

    message(txt, isAlert) {
        fadeBox(txt, isAlert);
    }
}

window.onload = mp.init();