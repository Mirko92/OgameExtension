<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import MpShipsForm from '~/components/MpShipsForm.vue';
import { useStore } from './store';

const store = useStore()

store.init()

const {
  storage,
} = storeToRefs(store)

function onChange(uniData: Universe){
    let { code: uni, expeditionConfig } = uniData;

    chrome.runtime.sendMessage(chrome.runtime.id,
        {
            method: "SAVE_EXPEDITION_CONFIG",
            data: {
                uni,
                expeditionConfig
            }
        } as MpRequest 
    );
}

</script>

<template>
<div class="page">
    <header>
        <section>
            <h1 v-t="'exp_conf.title'" />
        </section>
    </header>

    <section class="universes">
        <div class="universe" 
            v-for="u of storage?.ogameData"
            :key="u.code">
            <header>
                <h3>{{u.name}} - {{u.code}}</h3>
            </header>

            <MpShipsForm 
                v-model="u.expeditionConfig"
                @update:modelValue="onChange(u)"
            />
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
</style>