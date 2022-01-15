<template>
  <main class="popup">
    <h1>Stop</h1>

    <a 
      href="javascript:void(0)"
      @click="openOptionsPage">
      Options
    </a>
  </main>
</template>

<style scoped>
.popup {
  width: 300px;
  height: 100px;
  padding: 1rem;
}
</style>

<script setup lang="ts">
function openOptionsPage() {
  chrome.runtime.openOptionsPage()
}
</script>
