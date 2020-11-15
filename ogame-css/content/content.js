console.debug("Content js is running...");

var playerName = $('#playerName span').last()[0].textContent.trim();

var [inputMet, inputCry, inputDeu] = $(".normalResource input");

console.debug("Input met:", inputMet);
console.debug("Input cry:", inputCry);
console.debug("Input deu:", inputDeu);

var [maxBtnMet, maxBtnCry, maxBtnDeu] = $(".normalResource a.max");

console.debug("Max btn met:", maxBtnMet);
console.debug("Max btn cry:", maxBtnCry);
console.debug("Max btn deu:", maxBtnDeu);

var payBtn = $("a.pay")[0];
console.debug("Pay btn", payBtn);

var currentBetEl = $(".detail_value.odd.currentSum")[0];
console.debug("Current Bet El:", currentBetEl);

var currentPlayerEl = $('.currentPlayer')[0];
console.debug("Current Player El:", currentPlayerEl);

var interval = null;

var maxBet = 100000;

var myBet = 0;

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

function stop() {
    console.debug("STOP");
    clearInterval(interval);
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
/*
    - maxBet
    - timer
 */
function bot(maxBet, timer) {
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
    }, timer || 750);
}

