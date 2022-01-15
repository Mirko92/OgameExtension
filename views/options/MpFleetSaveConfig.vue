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

function getMissionOf(uni: string, planetId: string) {
  return storage.value?.ogameData.find((u: any) => u.code === uni)
    ?.planets.find((p: any) => p.id === planetId)?.fleetMission;
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

const {
  planetsOf
} = store; 

function toggleAll(universe: Universe){
  if (isAllEnabled(universe)) {
    disableAll(universe)
  } else {
    enableAll(universe)
  }

  const toSave = universe?.planets
    .map(p =>({
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
  universe.planets?.forEach(p => p.fleetMission.enabled = true)
}

function disableAll(universe: Universe) {
  universe.planets?.forEach(p => p.fleetMission.enabled = false)
}

function isAllEnabled(universe: Universe){
  return universe.planets.every(p => p.fleetMission.enabled )
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
            {{u.name}} - {{u.code}}
          </td>
        </tr>

        <th>
          <input 
            type="checkbox" 
            id="enableAll"
            name="enableAll"
            :checked="isAllEnabled(u.code)"
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
                @update="onUpdateFleetMission(u.code, p.id)"
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