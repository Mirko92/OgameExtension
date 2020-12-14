//#region START LOG
console.debug("#######################################");
console.debug("Content js is running...");
console.debug("Mp Ogame extension. ID:", chrome.runtime.id);
// FIXME: Update versione vefore release
console.info("v.0.0.8");
console.debug("#######################################");
//#endregion

//#region UTILS
/**
 * Return server name 
 * Eg: s170-it
 */
function server() {
    const url = location.href;
    return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(url)[1]
}
//#endregion

/**
 * Update fleet info, collected till now. 
 */
function getFleetInfo() {
    console.debug("getFleetInfo()");

    chrome.runtime.sendMessage(
        { method: "GET_FLEET_INFO", data: { uni: server() } },
        response => {
            console.debug("Get fleet info response", response);
            localStorage.setItem("mp_" + server(), JSON.stringify(response));
        }
    );
}

//#region FLEET BUTTONS
function addFleetsButton() {
    const planets = document.querySelectorAll('#planetList > div');

    planets.forEach(container => {
        const planetCoordsText = container.querySelector('.planetlink .planet-koords').textContent;
        const regexResult = /\[(\d):(\d*):(\d*)\]/.exec(planetCoordsText);

        const [g,s,p] = [1,2,3].map(index => regexResult[index]);
        const coords = `${g}_${s}_${p}`

        const planet = `${coords}_1`;
        const moon = container.querySelector('.moonlink') ? `${coords}_3` : null;

        container.appendChild(fleetButton(planet, moon));
    });
};

function fleetButton(planet, moon) {
    let button = document.createElement('button');
    button.classList = 'mp_fleet_button fleet_icon_forward_end';
    button.title = 'Run fleet save';

    button.setAttribute('data-planet', planet);
    if(moon){
        button.setAttribute('data-moon', moon);
    }
    return button;
}

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


getFleetInfo();
// addFleetsButton();


//#region WepPage script
/*
    Script to direct interaction with Ogame.js
*/
var scriptEL = document.createElement("script");
scriptEL.innerHTML = `
const MP_MISSIONS = {
    ATTACK: 1,
    UNIONATTACK: 2,
    TRANSPORT: 3,
    DEPLOY: 4,
    HOLD: 5,
    ESPIONAGE: 6,
    COLONIZE: 7,
    RECYCLE: 8,
    DESTROY: 9,
    MISSILEATTACK: 10,
    EXPEDITION: 15
};

const MP_PLANET_TYPES = {
    PLANET: 1,
    DEBRIS: 2,
    MOON: 3
};

window.mp = {
    server: "${server()}",

    extensionId: "${chrome.runtime.id}",

    fleetToken(){
        return localStorage.getItem('mp_fleet_token');
    },
    
    /**
     * Add fleet buttons next to every planet
     */
    addFleetActions() {
        const fleetButtons = document.querySelectorAll('.mp_fleet_button');
        fleetButtons.forEach(btn => btn.onclick = this.quickFleetSave);
    },

    /**
     * Add fleet button in the first step of fleetDispatcher 
    */
    addFleetButton(){
        const continueButton = document.querySelector('#continueToFleet2');
        continueButton.insertAdjacentHTML('afterend','<a class="continue fright on" href=""><span>Ciaone</span></a>')
    },

    getFleetParams(){
        // const planet = this?.getAttribute('data-planet');
        // const moon = this?.getAttribute('data-moon');

        return new URLSearchParams({
            token: this.fleetToken(),
            speed:10,
            mission: MP_MISSIONS.TRANSPORT,
            //TO:
            galaxy: 1,
            system: 299,
            position: 6,
            type: MP_PLANET_TYPES.MOON,
            //HOLD:
            metal:1000,
            crystal:0,
            deuterium:0,

            prioMetal:1,
            prioCrystal:2,
            prioDeuterium:3,

            retreatAfterDefenderRetreat:0,
            union:0,
            holdingtime:0,

            //Ships
            am203:1,
        }).toString();
    },

    quickFleetSave(event) {
        let fleetUrl = ogameUrl+"/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1";
        let referrer = ogameUrl+"/game/index.php?page=ingame&component=fleetdispatch"; 

        fetch(fleetUrl, {
            "headers": {
                // "accept": "*/*",
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "it,it-IT;q=0.9,en;q=0.8,en-US;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": referrer,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": this.getFleetParams(),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(x => {
            console.debug("Fleet save response");
            // x.json().then(body => {
            //     const response = body.response;
            //     fadeBox(response.message, !response.success);
            //     miniFleetToken = body.newToken;
            // })
        });
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
                // TODO: Gestione local storage in file a parte 
                localStorage.setItem('mp_fleet_token', fleetDispatcher.fleetSendingToken);
                this.saveFleetInfo(this.server, currentPlanet, shipsOnPlanet);
                break;
            default:
                break;
        }

        // this.addFleetActions();

    }
}

window.onload = mp.init();
`;
document.head.appendChild(scriptEL);
//#endregion
