<script lang="ts" setup>
    import { useStore } from './store';
    import { storeToRefs } from 'pinia';

    const store = useStore()
    store.init()
    const { storage } = storeToRefs(store)


    function submit() {
        chrome.runtime.sendMessage(chrome.runtime.id,
            {
                method: "SAVE_SETTINGS",
                data: {
                    settings: storage.value?.ogameData
                        ?.map(({settings, code}) => ({uni: code, ...settings}))
                }
            } as MpRequest,

            () => {
                alert("Settings saved!")
            }
        );
    }
</script>

<template>
<div class="page">
    <header>
        <section>
            <h1 v-t="'mp_settings.title'" />
        </section>
    </header>

    <section class="universes">
        <div class="universe" 
            v-for="u of storage?.ogameData"
            :key="u.code">
            <header>
                <h3>Uni: {{u.name}} - {{u.code}}</h3>
            </header>

            <section>
                <h3>Riserva di deuterio (K)</h3>
                <p>Deuterio che intendi conservare su ciascuna colonia/luna</p>
                <div class="d-f-r j-c-c">
                    <input 
                        type="number" 
                        class="mp_input"
                        style="width: 10rem; text-align: center;"
                        v-model="u.settings.deuReserve"
                    />
                    <!-- <div><small>Espresso in migliaia</small></div> -->
                </div>
            </section>

            <section>
                <span>Attiva per mostrare i fastidiosissimi banner pubblicitari</span>

                <label :for="`showBanner_${u.code}`" class="d-f-r a-i-c j-c-b">
                    <h3>Mostra banner pubblicitari</h3>
                    <input 
                        :id="`showBanner_${u.code}`" 
                        type="checkbox" 
                        class="mp_input"
                        v-model="u.settings.displayBanner" 
                    >
                </label>
            </section>

            <section>
                <span>Attiva per mostrare la barra della GameForge</span>

                <label :for="`gfBar${u.code}`" class="d-f-r a-i-c j-c-b">
                    <h3>Mostra barra GameForge</h3>
                    <input 
                        :id="`gfBar${u.code}`"
                        class="mp_input" 
                        type="checkbox" 
                        v-model="u.settings.displayGfBar" 
                    > 
                </label>
            </section>

            <section class="d-f-r j-c-c" id="mp_app">
                <button class="mp_button" @click="submit">
                    Salva
                </button>
            </section>
            
        </div>
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

.universes {
    display: flex;
    gap: 1rem;
}

.universe {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(1px);
  padding: 1rem;
}

.universe header *{
    background: rgb(125 92 162 / 60%);
    margin: 0;
    padding: 0.5rem;
    border-radius: var(--border-radius);
}

.universe section {
  background: rgb(125 92 162 / 60%);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  margin: 0.25rem 0;
}
.universe section:focus-within {
  background: rgb(125 92 162 / 75%);
}

.universe section.center {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.mp_card {
  background-color: rgba(172, 172, 172, 0.623);
  backdrop-filter: blur(15px);
  border-radius: var(--border-radius);
  padding: var(--default-padding);
}
</style>