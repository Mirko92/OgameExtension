<script setup lang="ts">
import MpFleetSaveConfig  from './MpFleetSaveConfig.vue'
import MpExpeditionConfig from './MpExpeditionConfig.vue'
import MpAbout  from './MpAbout.vue'
import MpMenu   from './MpMenu.vue'

const isActive = ref(false)

const currentView = ref<OptionPage>('FLEET_SAVE_CONFIG')

const component = computed( () => { 
  switch (currentView.value) {
    case "FLEET_SAVE_CONFIG":
      return MpFleetSaveConfig
    case "EXPEDITION_CONFIG":
      return MpExpeditionConfig
    case "ABOUT":
      return MpAbout
    default:
      break;
  }
})

// onMounted(() => {
//   const u = new URL(window.location.href)
//   const v = u.searchParams.get('view') as OptionPage
//   if (v) {
//     currentView.value = v
//   }
// })
</script>

<template>
  <MpMenu 
    v-model:view="currentView"
    v-model:isActive="isActive"
  />

  <main class="options__main">
    <Component :is="component" />
  </main>
</template>

<style scoped>
.options__main {
  height: 100vh;

  overflow-y: auto;
  /* scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  scroll-padding-block: 5rem; */
}
</style>