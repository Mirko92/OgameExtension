
console.debug("Mp Ogame extension. ID: %s - Version: ",
    chrome.runtime.id,
    chrome.runtime.getManifest().version
);

(async () => {
    const utils = await import(chrome.extension.getURL('assets/scripts/mp_utils.js'));

    this.planetIds = utils.planetIds;
}).apply(this);


function run(script) {
    document.body.insertAdjacentHTML("afterend",`<button id="runscript" hiddent onclick="${script}">Run script</button>`);
    const btn = document.getElementById('runscript');
    btn.click();
    btn.remove();
}

/**
 * Save Extension version on localstorage 
 */
localStorage.setItem('mp_ogame_ext_id', chrome.runtime.id);

/**
 * Main menu buttons 
 */
document
    .querySelector("#menuTable li:last-child")
    .insertAdjacentHTML(
        "afterend",
        `<li>
            <span class="menu_icon">
                <span class="menuImage"></span>
            </span>
            <a  class="menubutton" 
                href="javascript:void(0);"
                onclick="mp.automaticFleetSave()">
                <span class="textlabel">Fleet save</span>
            </a>
        </li>
        <li>
            <span class="menu_icon">
                <span class="menuImage"></span>
            </span>
            <a  class="menubutton" 
                href="javascript:void(0);"
                onclick="mp.updateFleets()">
                <span class="textlabel">Update Fleets</span>
            </a>
        </li>`
    );


//#region WepPage script
/*
    Script to direct interaction with Ogame.js
*/
var ogameScript = document.createElement("script");
ogameScript.setAttribute('type', "module");
ogameScript.src = chrome.extension.getURL("assets/scripts/mp_ogame.js");
document.head.appendChild(ogameScript);
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


