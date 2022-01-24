<script lang="ts" setup>

</script>

<template>
<div class="page">
    <header>
        <h1 v-t="'mp_settings.title'">Settings</h1>
    </header>

    <h3>TODO</h3>
    <ul>
        <li>Deuterio da lasciare su luna</li>
        <li>CSS configurarion per pubblicità e barra gf</li>
    </ul>
    <div class="mp_card">
        <h3>Riserva di deuterio</h3>
        <div>Riserva di deuterio che verrà esclusa dai trasporti automatici</div>
        <input 
            type="number" 
            class="mp_input"
        />
    </div>
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

.mp_card {
  background-color: rgba(255, 255, 255, 0.623);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  padding: var(--default-padding);
}
</style>