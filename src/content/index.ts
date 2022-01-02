/**
 * Print current version and ID extension
 */
 console.debug(
  "Mp Ogame extension. ID: %s - Version: ",
  chrome.runtime.id,
  chrome.runtime.getManifest().version
)

/**
* Save Extension version on localstorage 
*/
localStorage.setItem('mp_ogame_ext_id', chrome.runtime.id)

/**
 * Function to run external script 
 */
export function run(script: string) {
  document.body.insertAdjacentHTML(
    "afterend",
    `<button id="runscript" hiddent onclick="${script}">Run script</button>`
  )

  const btn = document.getElementById('runscript')
  btn!.click()
  btn!.remove()
}

function createScriptModule(extensionUrl: string) {
  const script = document.createElement("script")
  script.setAttribute('type', "module")
  script.src = chrome.extension.getURL(extensionUrl)
  return script 
}

//#region INJECTION VUE APP 
const appTemplatePath = chrome.extension.getURL("assets/scripts/app.html")
fetch(appTemplatePath)
    .then(content => content.text())
    .then(html => {
        const div = document.createElement('div')
        div.setAttribute('id', 'mp_app')
        div.innerHTML = html
        document.body.appendChild(div)

        // Load Vue AppJS Script 
        document.body.append(createScriptModule("assets/scripts/app.js"))
    })
//#endregion

/** Load MpOgame script */
document.head.appendChild(createScriptModule("assets/scripts/mp_ogame.js"))

//#region TRADER
var interval: NodeJS.Timer; 

function getPlayerName() {
  const playerNameChilds = document.querySelectorAll('#playerName span');
  return playerNameChilds[playerNameChilds.length - 1].textContent!.trim();
}

function getInputMet() {
  return document.querySelectorAll<HTMLInputElement>(".normalResource input").item(0)
}

function getMaxButtons() {
    return document.querySelectorAll<HTMLButtonElement>(".normalResource a.max").item(0)
}

function getPayButton() {
    return document.querySelectorAll<HTMLButtonElement>("a.pay").item(0)
}

/*
  - maxBet: number 
  - timer: nubmer (milliseconds)
 */
export function bot(maxBet: number, timer: number) {
  const [
    playerName, inputMet, maxBtnMet, payBtn
  ] = [
    getPlayerName(), getInputMet(), getMaxButtons(), getPayButton()
  ]

  function getCurrentPlayerName() {
    const cp = document.querySelectorAll('.currentPlayer').item(0)
    return cp.textContent?.trim();
  }

  function getCurrentBet() {
    const currentBetEl = document.querySelectorAll(".detail_value.odd.currentSum").item(0)
    return Number.parseInt(currentBetEl.textContent!.replaceAll('.', ''))
  }
  let myBet: string|number = '0'; 
  function submit() {
      myBet = inputMet.value
      payBtn.click()
  }

  interval = setInterval(() => {

      if (getCurrentPlayerName() === playerName) {
          myBet = getCurrentBet()
          console.debug("Current Player match your name")
          return
      }

      if (getCurrentBet() >= maxBet) {
          console.debug("Current bet is over the limit")
          stop()
          return
      }

      maxBtnMet.click()

      submit()
  }, timer || 1050)
}

export function betMetal() {
  const maxBtnMet = getMaxButtons()
  maxBtnMet.click()
  getPayButton().click()
}

export function stop() {
  clearInterval(interval)
}
//#endregion

/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'

console.info('[vitesse-modernized-chrome-ext] Hello world from content script')

// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-modernized-chrome-ext] Navigate from page "${data.title}"`)
})
