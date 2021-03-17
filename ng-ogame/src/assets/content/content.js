
console.debug("Mp Ogame extension. ID: %s - Version: ",
    chrome.runtime.id,
    chrome.runtime.getManifest().version
);

/**
 * Save Extension version on localstorage 
 */
localStorage.setItem('mp_ogame_ext_id', chrome.runtime.id);

function run(script) {
    document.body.insertAdjacentHTML("afterend", `<button id="runscript" hiddent onclick="${script}">Run script</button>`);
    const btn = document.getElementById('runscript');
    btn.click();
    btn.remove();
}


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

function getMaxButtons() {
    return document.querySelectorAll(".normalResource a.max");
}

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


