<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "./store"

import { useCharacterClasses }  from "~/logic/useCharacterClasses";

import MpMissionSelect          from "~/components/MpMissionSelect.vue"
import MpMissionTypeSelect      from "~/components/MpMissionTypeSelect.vue";
import MpMissionSpeed           from "~/components/MpMissionSpeed.vue";
import MpPlanetIcon             from "~/components/MpPlanetIcon.vue";
import MpPlanetNameCoords       from "~/components/MpPlanetNameCoords.vue";

const store = useStore()

store.init()

const {
  storage,
  filters,
} = storeToRefs(store)

watch([storage],() => {
  console.debug("Storage changed")
}, {
  deep: true,
})

const {
  planetsOf
} = store; 

const { isWarrior } = useCharacterClasses()

const selected = ref<string[]>([])
function toggleAll(universeCode: string){
  if (isAllSelected(universeCode)) {
    unselectAll()
  } else {
    selectAll(universeCode)
  }
}

function selectAll(universeCode: string) {
  selected.value = storage?.ogameData?.value?.find((u:any) => u.code === universeCode)
    ?.planets?.map((p: any) => p.id)
}

function unselectAll() {
  selected.value = []
}

function isAllSelected(universeCode: string){
  const u = storage?.ogameData?.value?.find((u: any) => u.code === universeCode)
  return u?.planets.every((p: any) => selected.value.includes(p.id))
}

function isSelected(planetId: string) {
  return selected.value.includes(planetId)
}

function unselect(planetId: string) {
  selected.value = selected.value.filter((id: string) => id !== planetId)
}

function select(planetId: string) {
  selected.value.push(planetId)
}

function toggle(planetId: string) {
  if (isSelected(planetId)) {
    unselect(planetId)
  } else {
    select(planetId)
  }
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
            :checked="isAllSelected(u.code)"
            @click="toggleAll(u.code)"
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
              :checked="isSelected(p.id)"
              @click="toggle(p.id)"
            >
          </td>

          <td> <MpPlanetIcon :type="p.type" /> </td>

          <td> <MpPlanetNameCoords :planet="p" /> </td>

          <td>
            <MpCoordsInput 
              v-model:galaxy="p.fleetMission.galaxy"
              v-model:system="p.fleetMission.system"
              v-model:position="p.fleetMission.position"
            />
            <div class="d-f-r j-c-c a-i-c gap05">
              <MpMissionTypeSelect 
                v-model.number="p.fleetMission.type"
              />
            </div>
          </td>

          <td>
            <MpMissionSpeed 
              v-model="p.fleetMission.velocity"
              :isWarrior="isWarrior()"
            />
          </td>

          <td>
            <MpMissionSelect v-model="p.fleetMission.mission"/>
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