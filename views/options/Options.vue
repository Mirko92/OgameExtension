<script setup lang="ts">
import MpFleetSaveConfig from './MpFleetSaveConfig.vue'
import MpAbout from './MpAbout.vue'
import MpMenu from './MpMenu.vue'

const isActive = ref(false)

const currentView = ref('FLEET_SAVE_CONFIG')

const component = computed( () => { 
  switch (currentView.value) {
    case "FLEET_SAVE_CONFIG":
      return MpFleetSaveConfig
    case "ABOUT":
      return MpAbout
    default:
      break;
  }
})
</script>

<template>
  <MpMenu v-model:isActive="isActive"/>

  <main class="options__main">
    <Component :is="component" />
  </main>
</template>

<style scoped>
.options__main {
  height: 100vh;

  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}
</style>