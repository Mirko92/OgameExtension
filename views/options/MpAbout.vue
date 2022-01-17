<script lang="ts" setup>
const version = chrome.runtime.getManifest().version;
</script>
<template>
<div class="page">
    <header>
        <h1>About Ogame MP</h1>
        <h5>Version: {{version}}</h5>
    </header>

    <section>

    </section>
</div>
</template>

<style scoped>
.page {
    display: grid;
    place-items: center;
    place-content: center;
    color: white;
    height: 100%;
}
</style>