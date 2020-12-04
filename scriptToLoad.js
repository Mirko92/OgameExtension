`
    window.mp = {
        init:function(){
            console.debug("Init ogame extension");

            console.debug("Player name: ", player.name);

            console.debug("Current page: ", currentPage);


            switch (currentPage) {
                case "fleetdispatch":
                    localStorage.setItem('mp_fleet', shipsData);
                    break;
            
                default:
                    break;
            }

        },

        goToFleet(){
            window.location = 'index.php?page=ingame&component=fleetdispatch';
        },

        message(txt, isAlert){
            fadeBox(txt, isAlert);
        }
    }

    window.onload = mp.init();
`;