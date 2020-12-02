console.debug("Content js is running...");

console.debug("Current Extension ID:", chrome.runtime.id);

console.debug("Stampare versione");

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.greeting == "hello")
            sendResponse({ farewell: "goodbye" });
    }
);



/*
    Aggiungo un elemento script alla pagina
    con la speranza di sfruttarlo per farmi passare l'oggetto window
 */
var scriptEL = document.createElement("script");
scriptEL.innerHTML = `
    window.mp = {
        init:function(){
            console.debug("Init ogame extension");

            console.debug("Player name: ", player.name);

            console.debug("Current page: ", currentPage);

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

document.head.appendChild(scriptEL);

function prova(a){
    console.debug("prova", a );
}

var interval = null;

/*
    - maxBet
    - timer
 */
function bot(maxBet, timer) {

    var playerNameChilds = document.querySelectorAll('#playerName span');
    var playerName = playerNameChilds[playerNameChilds.length - 1].textContent.trim();
    console.debug("Player Name: ", playerName);

    var [inputMet, inputCry, inputDeu] = document.querySelectorAll(".normalResource input");

    console.debug("Input met:", inputMet);
    console.debug("Input cry:", inputCry);
    console.debug("Input deu:", inputDeu);

    var [maxBtnMet, maxBtnCry, maxBtnDeu] = document.querySelectorAll(".normalResource a.max");

    console.debug("Max btn met:", maxBtnMet);
    console.debug("Max btn cry:", maxBtnCry);
    console.debug("Max btn deu:", maxBtnDeu);

    var payBtn = document.querySelectorAll("a.pay")[0];
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

function stop() {
    console.debug("STOP");
    clearInterval(interval);
}

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

