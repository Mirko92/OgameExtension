let runBtn = document.getElementById('run_btn');
let stopBtn = document.getElementById('stop_btn');
let maxBetInput = document.getElementById('maxBetInput');

runBtn.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: `bot(${maxBetInput.value})` });
    });
};

stopBtn.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'stop();' });
    });
};