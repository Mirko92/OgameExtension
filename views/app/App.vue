<template>
  <div id="mp_app">
    <div class="app_container"
        :class="{'open' : isOpen}">

        <div class="mission">
            <section>
                <header>
                    <h5>
                        Navi
                    </h5>
                </header>

                <div class="ship"
                    v-for="ship in shipsOptions"
                    :key="ship.id">
                    <span class="ship__name">{{ship.name}}</span>
                    <span class="ship__number">
                        <input type="number"
                            placeholder="0" 
                            min="0"
                            v-model="result[`am${ship.id}`]"/>
                    </span>
                </div>
            </section>

            <section>
                <header>
                    <h5>
                        Destinazione
                    </h5>
                </header>

                <div class="destination">
                    <input type="number"
                        min="1"
                        max="9"
                        v-model="result.galaxy">
                    <input type="number"
                        min="1"
                        max="999"
                        v-model="result.system">
                    <input type="number"
                        min="1"
                        max="16"
                        v-model="result.position">
                </div>

                <div class="destination_type">
                    <label for="planet_type">Pianeta</label>
                    <input type="radio"
                        name="dest_type"
                        value="1"
                        id="planet_type"
                        v-model="result.type">

                    <label for="debris_type">Detriti</label>
                    <input type="radio"
                        name="dest_type"
                        value="2"
                        id="debris_type"
                        v-model="result.type">

                    <label for="moon_type">Luna</label>
                    <input type="radio"
                        name="dest_type"
                        value="3"
                        id="moon_type"
                        v-model="result.type">
                </div>
            </section>

            <section>
                <header>
                    <h5>
                        Velocità {{result.speed}}%
                    </h5>
                </header>

                <div class="speed">
                    <input type="range"
                        name="spedd"
                        id="speed_range"
                        max="100"
                        :min="isWarrior() ? 5 : 10"
                        :step="isWarrior() ? 5 : 10"
                        v-model="result.speed">
                </div>
            </section>

            <section>
                <header>
                    <h5>
                        Missione
                    </h5>
                </header>

                <div class="mission">
                    <select v-model="result.mission">
                        <option value="1">ATTACCO</option>
                        <option value="3">TRASPORTO</option>
                        <option value="4">SCHIERAMENTO</option>
                        <option value="5">STAZIONAMENTO</option>
                        <option value="6">SPIONAGGIO</option>
                        <option value="7">COLONIZZAZZIONE</option>
                        <option value="8">RICICLAGGIO</option>
                        <option value="15">SPEDIZIONE</option>
                    </select>
                </div>
            </section>

            <section class="center prova">
                <button class="mp_button"
                        @click="sendMission">
                    Invia Missione
                </button>
            </section>

        </div>
    </div>
    <button title="Apri/Chiudi"
            class="toggle_button"
            @click="toggle">
    </button>
  </div>
</template>

<style scoped>
.prova { color: red !important;}
</style>

<script lang="ts" setup>
declare const mp: any; 

import { shipsOptions } from "../logic/shipsOptions"
import { useCharacterClasses } from "../logic/useCharacterClasses"

const isSending = ref(false)

const isOpen    = ref(
  JSON.parse(sessionStorage.getItem('mp_dialog')!)
)
const lastMission   = 
  JSON.parse(sessionStorage.getItem('mp_last_mission')!)

const result = reactive({
    speed   : lastMission?.speed ? (lastMission?.speed * 10) : 100,
    type    : lastMission?.type     || 1,
    mission : lastMission?.mission  || 1,
    ...(lastMission || {})
});

onMounted(() => {
  if (!mp) return;

    if (!lastMission) {
        const cp = mp.fleetDispatcher._currentPlanet
        result.galaxy   = cp?.galaxy;
        result.system   = cp?.system;
        result.position = cp?.position;
    }
})

function toggle() {
    isOpen.value = !isOpen.value;

    sessionStorage.setItem('mp_dialog', isOpen.value);
}


const {
    isWarrior
} = useCharacterClasses()

async function sendMission() {
    const params = {...result};
    params.speed = params.speed/10;
    
    const token = await mp.fleetDispatcher.getToken();

    const body = new URLSearchParams({
        token,
        //HOLD:
        metal     : 0,
        crystal   : 0,
        deuterium : 0,

        prioMetal     : 1,
        prioCrystal   : 2,
        prioDeuterium : 3,

        ...result
    }).toString();

    try {
        isSending.value = true; 

        sessionStorage.setItem(
            'mp_last_mission', 
            JSON.stringify(result)
        );
        
        await mp.fleetDispatcher.sendFleet(body);
        location.reload();
    } catch (error) {
        console.error("Invio flotta non riuscito", error);
        
        mp.message("Invio flotta non riuscito");
    } finally {
        isSending.value = false;
    }
  }

</script>