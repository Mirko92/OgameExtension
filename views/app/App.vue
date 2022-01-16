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

      <a href="javascript:void(0)" @click.prevent="goToOptions">Options</a>
      
    </div>
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

const isOpen    = ref(
  JSON.parse(sessionStorage.getItem('mp_dialog')!)
)

function toggle() {
    isOpen.value = !isOpen.value;

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
</script>