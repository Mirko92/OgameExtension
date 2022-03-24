<template>
  <div id="mp_app">
    <div class="app_container"
      :class="{'open' : isOpen}">

      <header>
        <MpTabs v-model="currentView" />
      </header>

      <main style="flex: 1;">
        <transition
          name="fade"
          mode="out-in"
          appear
        >
          <Component :is="getComponent()" />
        </transition>

      </main>

      <footer class="d-f-r j-c-b">
        <a href="javascript:void(0)" @click.prevent="goToOptions">Options</a>
        <a href="javascript:void(0)" @click.prevent="openDialog">Statistics</a>
      </footer>
    </div>

    <transition name="slide-fade" >
      <div id="mp_dialog" v-if="displayDialog">
        <header>
          <h2 class="black my0">
            Statistiche
          </h2>
          <i class="close_icon"
              @click="closeDialog">
            &times;
          </i>
        </header>

        <section>
          <MpStatistics />
        </section>

        <footer class="d-f-r j-c-b">
          <a href="javascript:void(0)"
              @click="back">
            indietro
          </a>
          <a href="javascript:void(0)"
            @click="closeDialog">
            chiudi
          </a>
        </footer>
      </div>
    </transition>

    <button title="Apri/Chiudi"
            class="toggle_button"
            @click="toggle">
    </button>
  </div>
</template>

<script lang="ts" setup>
import MpTabs            from "./MpTabs.vue";
import MpFleetDispatcher from "./MpFleetDispatcher.vue";
import MpMissions        from "./MpMissions.vue";
import MpTrader          from "./MpTrader.vue";
import MpStatistics from "./MpStatistics.vue";

const isOpen    = ref(
  JSON.parse(sessionStorage.getItem('mp_dialog')!)
)

function toggle() {
    isOpen.value = !isOpen.value;
    displayDialog.value = false; 

    sessionStorage.setItem('mp_dialog', isOpen.value);
}

const currentView = ref(
  sessionStorage.getItem("mp_dialog_current_view") || "FLEET_FORM"
);

watch(currentView, () => {
    sessionStorage.setItem(
      'mp_dialog_current_view', 
      currentView.value
    );
})

function getComponent() {
  switch (currentView.value) {
    case "FLEET_FORM":
      return MpFleetDispatcher;      

    case "TRADER":
      return MpTrader;      

    case "MISSIONS":
      return MpMissions;
  }
}

function goToOptions() {
  chrome.runtime.sendMessage(
    window.mp.extensionId,
    { method: 'OPEN_OPTIONS'}
  )
}

function escHandler(e: KeyboardEvent) {
  if (e.code === "Escape") {
    closeDialog();
  }
}
function addEscHandler() {
  document.addEventListener('keyup', escHandler)
}
function removeEscHandler() {
  document.removeEventListener('keyup', escHandler)
}

const displayDialog = ref(false)
function openDialog() {
  toggle()
  displayDialog.value = true
  addEscHandler()
}
function closeDialog() {
  displayDialog.value = false
  removeEscHandler()
}
function back() {
  closeDialog()
  toggle()
}
</script>