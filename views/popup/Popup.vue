<template>
  <main id="mp_app" class="popup">
    <section class="d-f-c">
      
      <button 
        class="mp_button"
        @click="stopAll">
        STOP ALL 
      </button>
  
      <a 
        class="mt05"
        href="javascript:void(0)"
        @click="openOptionsPage">
        Options
      </a>
    </section>
  </main>
</template>

<style scoped>
.popup {
  width: 300px;
  height: 100px;
  padding: .5rem;
}

.popup section {
  margin: 0;
}

.popup a {
  color: white;
}
</style>

<script setup lang="ts">
function openOptionsPage() {
  chrome.runtime.openOptionsPage()
}

/**
 * Function to execute in DOM 
 * to STOP running mission 
 */
function runScript(script: string) {
  document.body.insertAdjacentHTML(
    "afterend",
    `<button id="runscript" hidden onclick="${script}">Run script</button>`
  )

  const btn = document.getElementById('runscript')
  btn!.click()
  btn!.remove()
}

const clearMission = "window.mp.clearMissions();"

async function stopAll() {
  const currentTab = await chrome.tabs.query({
    currentWindow: true,
    active: true
  })

  chrome.scripting.executeScript({
    target: { tabId: currentTab[0].id! },
    func: runScript,
    args: [ clearMission ]
  })
}
</script>
