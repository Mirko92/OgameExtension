<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "./store"

import { useCharacterClasses }  from "~/logic/useCharacterClasses";

import MpMissionSelect          from "~/components/MpMissionSelect.vue"
import MpMissionTypeSelect      from "~/components/MpMissionTypeSelect.vue";
import MpMissionSpeed           from "~/components/MpMissionSpeed.vue";
import MpPlanetIcon             from "~/components/MpPlanetIcon.vue";
import MpPlanetNameCoords       from "~/components/MpPlanetNameCoords.vue";

const { isWarrior } = useCharacterClasses()

const store = useStore()

store.init()

const {
  storage,
  filters,
} = storeToRefs(store)

const {
  planetsOf
} = store; 

function getMissionOf(uni: string, planetId: string) {
  return storage.value?.ogameData
    ?.find((u: any) => u.code === uni)
    ?.planets.find(p => p.id === planetId)?.fleetMission;
}

function onUpdateFleetMission(uni: string, planetId: string) {
  chrome.runtime.sendMessage({
    method: 'SAVE_FLEETSAVE_MISSION',
    data: {
      uni, planetId,
      mission: getMissionOf(uni, planetId),
    }
  })
}

function toggleAll(universe: Universe){
  if (isAllEnabled(universe)) {
    disableAll(universe)
  } else {
    enableAll(universe)
  }

  saveMany(universe)
}

function saveMany(universe: Universe) {
  const toSave = planetsOf(universe.code)?.map(p =>({
    planetId: p.id,
    mission: p.fleetMission
  }))

  chrome.runtime.sendMessage({
    method: 'SAVE_MANY_FLEETSAVE_MISSIONS',
    data: {
      uni: universe.code,
      planets: toSave
    }
  })
}

function enableAll(universe: Universe) {
  planetsOf(universe.code)?.forEach(p => p.fleetMission.enabled = true)
}

function disableAll(universe: Universe) {
  planetsOf(universe.code)?.forEach(p => p.fleetMission.enabled = false)
}

function isAllEnabled(universe: Universe){
  return planetsOf(universe.code).every(p => p.fleetMission.enabled )
}


const position  = ref<string>('')
const type      = ref()
const speed     = ref<string>('')
const mission   = ref<string>('')
function applyToAll(universe: Universe) {
  const planets = planetsOf(universe.code)
  if (!planets) return

  planets.forEach(p => {
    p.fleetMission.galaxy   = p.galaxy
    p.fleetMission.system   = p.system

    p.fleetMission.position = position.value
    p.fleetMission.velocity = speed.value
    p.fleetMission.mission  = mission.value
    p.fleetMission.type     = type.value
  })

  saveMany(universe)
} 

</script>

<template>
  <div class="universe"
    v-for="u of storage?.ogameData"
    :key="u.code"
  >
    <table class="fleet_save_table">
      <thead>
        <tr style="text-align: center;">
          <td colspan="100">
            <h3 class="universe_name_code">{{u.name}} - {{u.code}}</h3>
          </td>
        </tr>

        <tr>
          <td colspan="100">
            <div class="px1">
              Modifica ed applica a tutti i pianeti/lune visibili
              <br>
              <small>In questo caso Galassia e Sistema corrisponderanno a quelli di partenza</small>
            </div>
            <form 
              @submit.prevent="applyToAll(u)"
              class="d-f-r gap05 p1">
              <div>
                <label>Posizione: </label>
                <input 
                  min="1"
                  type="number"
                  style="width: 3rem;"
                  v-model="position" >
              </div>

              <MpMissionTypeSelect v-model.number="type" />

              <label>Velocità</label>
              <MpMissionSpeed 
                :isWarrior="isWarrior()" 
                v-model="speed"
              />

              <label>Missione</label>
              <MpMissionSelect v-model="mission"/>

              <button type="submit" >Applica</button>
            </form>
          </td>
        </tr>

        <th>
          <input 
            type="checkbox" 
            id="enableAll"
            name="enableAll"
            :checked="isAllEnabled(u)"
            @change="toggleAll(u)"
          >
        </th>
  
        <th>
          <select v-if="filters[u.code]" v-model="filters[u.code].type">
            <option :value="null">
              All
            </option>
            <option :value="1">
              Only Planets
            </option>
            <option :value="3">
              Only Moons
            </option>
          </select>
        </th>
  
        <th>
          [Coordinate]
          <br />
          Nome
        </th>
  
        <th>
          Destinazione
        </th>
  
        <th>
          Velocità
        </th>
  
        <th>
          Missione
        </th>
      </thead>
  
      <tbody>
        <tr v-for="p of planetsOf(u.code)" :key="p.id">
          <td>
            <input 
              type="checkbox" 
              name="select" 
              id="select"
              v-model="p.fleetMission.enabled"
              @change="onUpdateFleetMission(u.code, p.id)"
            >
          </td>

          <td> <MpPlanetIcon :type="p.type" /> </td>

          <td> <MpPlanetNameCoords :planet="p" /> </td>

          <td>
            <MpCoordsInput 
              v-model:galaxy="p.fleetMission.galaxy"
              v-model:system="p.fleetMission.system"
              v-model:position="p.fleetMission.position"
              @update:galaxy="onUpdateFleetMission(u.code, p.id)"
              @update:system="onUpdateFleetMission(u.code, p.id)"
              @update:position="onUpdateFleetMission(u.code, p.id)"
            />
            <div class="d-f-r j-c-c a-i-c gap05">
              <MpMissionTypeSelect 
                v-model.number="p.fleetMission.type"
                @update:modelValue="onUpdateFleetMission(u.code, p.id)"
              />
            </div>
          </td>

          <td>
            <MpMissionSpeed 
              v-model="p.fleetMission.velocity"
              @update:modelValue="onUpdateFleetMission(u.code, p.id)"
              :isWarrior="isWarrior()"
            />
          </td>

          <td>
            <MpMissionSelect 
              v-model="p.fleetMission.mission"
              @update:modelValue="onUpdateFleetMission(u.code, p.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

.universe_name_code {
  margin: 0;
}
.universe {
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
  padding: 3rem 0;
}
.fleet_save_table {
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.623);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  padding: calc(var(--default-padding) / 2);
}

.fleet_save_table thead th,
.fleet_save_table tbody td{
  padding: var(--default-padding);
  text-align: center;
}
.fleet_save_table tbody tr {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}
</style>