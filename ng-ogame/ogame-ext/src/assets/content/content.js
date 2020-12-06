console.debug("#######################################");
//#region START LOG
console.debug("Content js is running...");
console.debug("Mp Ogame extension. ID:", chrome.runtime.id);
// FIXME: Update versione vefore release
console.info("v.0.0.8");
console.debug("#######################################");
//#endregion

localStorage.setItem('mp_ogame_ext_id', chrome.runtime.id);

//#region FLEET BUTTONS
function addFleetsButton() {
    const planets = document.querySelectorAll('#planetList > div');

    planets.forEach(p => {
        p.appendChild(fleetButton());
    });
};

function fleetButton() {
    let button = document.createElement('button');
    button.classList = 'mp_fleet_button fleet_icon_forward_end';
    button.title = 'Run fleet save';
    return button;
}

addFleetsButton();
//#endregion

//#region TRADER
var interval = null;

// TODO: In generale creare classe per il battitore 
function getMaxButtons() {
    return document.querySelectorAll(".normalResource a.max");
}

// TODO: scegliere nome migliore
function payButton() {
    return document.querySelectorAll("a.pay")[0];
}

/*
    - maxBet: number 
    - timer: nubmer (milliseconds)
 */
function bot(maxBet, timer) {

    console.debug("max bet", maxBet);
    console.debug("timer", timer);

    var playerNameChilds = document.querySelectorAll('#playerName span');
    var playerName = playerNameChilds[playerNameChilds.length - 1].textContent.trim();
    console.debug("Player Name: ", playerName);

    var [inputMet, inputCry, inputDeu] = document.querySelectorAll(".normalResource input");

    console.debug("Input met:", inputMet);
    console.debug("Input cry:", inputCry);
    console.debug("Input deu:", inputDeu);

    var [maxBtnMet, maxBtnCry, maxBtnDeu] = getMaxButtons();

    console.debug("Max btn met:", maxBtnMet);
    console.debug("Max btn cry:", maxBtnCry);
    console.debug("Max btn deu:", maxBtnDeu);

    var payBtn = payButton();
    console.debug("Pay btn", payBtn);

    var currentBetEl = document.querySelectorAll(".detail_value.odd.currentSum")[0];
    console.debug("Current Bet El:", currentBetEl);

    var currentPlayerEl = document.querySelectorAll('.currentPlayer')[0];
    console.debug("Current Player El:", currentPlayerEl);

    function getCurrentPlayerName() {
        return currentPlayerEl.textContent.trim();
    }

    function getCurrentBet() {
        return Number.parseInt(currentBetEl.textContent.replaceAll('.', ''));
    }

    function submit() {
        console.debug("Pay click");
        myBet = inputMet.value;
        payBtn.click();
    }


    console.debug("Max bet:", maxBet);
    console.debug("Player Name:", playerName);

    interval = setInterval(() => {

        if (getCurrentPlayerName() === playerName) {
            myBet = getCurrentBet();
            console.debug("Current Player match your name");
            return;
        }

        if (getCurrentBet() >= maxBet) {
            console.debug("Current bet is over the limit");
            stop();
            return;
        }

        console.debug("Max click");
        maxBtnMet.click();

        submit();
    }, timer || 1050);
}

function betMetal() {
    const [maxBtnMet] = getMaxButtons();
    maxBtnMet.click();
    payButton().click();

}

function stop() {
    console.debug("STOP");
    clearInterval(interval);
}
//#endregion

//#region GALAXY ACTIONS
function runInactiveEspionage() {
    let delay = 0;
    let step = 1000;
    document.querySelectorAll('#galaxytable tr.inactive_filter td.action a.espionage')
        .forEach(
            x => {
                setTimeout(() => x.click(), delay);
                delay += step;
            }
        );
}
//#endregion

//#region WepPage script
/*
    Script to direct interaction with Ogame.js
*/
var scriptEL = document.createElement("script");
scriptEL.innerHTML = `
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

        chrome.runtime.sendMessage(this.extensionId(), {["mp_"+uni] :uniData});
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
`;
document.head.appendChild(scriptEL);
//#endregion
