<template>
  <div id="mp_app">
    <div class="app_container"
      :class="{'open' : isOpen}">

      <header>
        <MpTabs v-model="currentView"/>
      </header>

      <main style="flex: 1;">
        <template v-if="currentView === 'FLEET_FORM'">
          <MpFleetForm />
        </template>

        <template v-if="currentView === 'TRADER'">
          <MpTrader />
        </template>
        
        <template v-if="currentView === 'MISSIONS'">
          <MpMissions />
        </template>
      </main>
      
    </div>
    <button title="Apri/Chiudi"
            class="toggle_button"
            @click="toggle">
    </button>
  </div>
</template>

<script lang="ts" setup>
import MpTabs from "./MpTabs.vue";
import MpFleetForm from "./MpFleetForm.vue";
import MpMissions from "./MpMissions.vue";
import MpTrader from "./MpTrader.vue";

const isOpen    = ref(
  JSON.parse(sessionStorage.getItem('mp_dialog')!)
)

function toggle() {
    isOpen.value = !isOpen.value;

    sessionStorage.setItem('mp_dialog', isOpen.value);
}

const currentView = ref("FLEET_FORM");
</script>