<script lang="ts" setup>
    const deuReserve = ref(1000)
    const banner = ref(false)
    const gfBar = ref(false)
</script>

<template>
<div class="page">
    <div class="mp_card">
        <header class="text-center">
            <h1 class="mt05" v-t="'mp_settings.title'" />
        </header>

        <hr>

        <section>
            <h3>Riserva di deuterio (K)</h3>
            <p>Deuterio che intendi conservare su ciascuna colonia/luna</p>
            <div class="text-center">
                <input 
                    type="number" 
                    class="mp_input"
                    style="width: 10rem; text-align: center;"
                    v-model="deuReserve"
                />
                <!-- <div><small>Espresso in migliaia</small></div> -->
            </div>
        </section>

        <hr>

        <section>
            <span>Attiva per mostrare i fastidiosissimi banner pubblicitari</span>

            <label for="showBanner" class="d-f-r a-i-c j-c-b">
                <h3>Mostra banner pubblicitari</h3>
                <input 
                    id="showBanner" 
                    type="checkbox" 
                    class="mp_input"
                    v-model="banner" 
                >
            </label>
        </section>

        <hr>

        <section>
            <span>Attiva per mostrare la barra della GameForge</span>

            <label for="gfBar" class="d-f-r a-i-c j-c-b">
                <h3>Mostra barra GameForge</h3>
                <input 
                    id="gfBar" 
                    class="mp_input" 
                    type="checkbox" 
                    v-model="gfBar" 
                > 
            </label>
        </section>

        <hr>
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
  background-color: rgba(172, 172, 172, 0.623);
  backdrop-filter: blur(15px);
  border-radius: var(--border-radius);
  padding: var(--default-padding);
}
</style>