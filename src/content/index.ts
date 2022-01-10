/**
 * Print current version and ID extension
 */
 console.debug(
  "[MpOgame extension] - ID: %s - Version: ",
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
  const script = document.createElement("script") as HTMLScriptElement
  script.setAttribute('type', "module")
  script.src = chrome.runtime.getURL(extensionUrl)
  return script 
}

//#region INJECTION MpOgame 
const mpOgameScript = createScriptModule("./dist/mp_ogame/index.global.js")
document.head.appendChild(mpOgameScript)
//#endregion
