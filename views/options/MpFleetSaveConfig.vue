<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "./store"

import MpMissionSelect from "~/components/MpMissionSelect.vue"
import MpMissionTypeSelect from "~/components/MpMissionTypeSelect.vue";
import MpMissionSpeed from "~/components/MpMissionSpeed.vue";

const store = useStore()

store.init()

const {
  storage
} = storeToRefs(store)

function getFleetMissionOf(missions: any[], planetId: string) {
  return missions?.find(m => 
    m.missionCode === 'fleet-mission' && m.planetId === planetId
  )
}

const universes = computed(() => {
  storage.value?.ogameData.forEach((u: any) => {
    u.planets = u.planets.map((p: any) => ({
      ...p,
      fleetMission: getFleetMissionOf(u.missions, p.id) || {}
    }))
  })

  return storage.value?.ogameData
})

function isWarrior() {
  // TODO: implement 
  return false
}

function destCoords({ galaxy:g, system:s, position:p}: any) {
  if (g && s && p) {
    return `${g}:${s}:${p}`
  } else {
    return '[-:-:-]'
  }
}


const selected = ref<string[]>([])
function toggleAll(universeCode: string){
  if (isAllSelected(universeCode)) {
    unselectAll()
  } else {
    selectAll(universeCode)
  }
}

function selectAll(universeCode: string) {
  selected.value = universes.value?.find((u:any) => u.code === universeCode)
    ?.planets?.map((p: any) => p.id)
}

function unselectAll() {
  selected.value = []
}

function isAllSelected(universeCode: string){
  const u = universes.value.find((u: any) => u.code === universeCode)
  return u.planets.every((p: any) => selected.value.includes(p.id))
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
    v-for="u of universes"
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
  
        <th/>
  
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
        <tr v-for="p of u.planets" :key="p.id">
          <td>
            <input 
              type="checkbox" 
              name="select" 
              id="select"
              :checked="isSelected(p.id)"
              @click="toggle(p.id)"
            >
          </td>

          <td>
            <div 
              class="planet_icon" 
              title="Planet" 
              v-if="p.type === 1"/>
            <div 
              class="moon_icon"  
              title="Moon" 
              v-if="p.type === 3"/>
          </td>

          <td>
            <div class="d-f-c j-c-c">[{{p.galaxy}}:{{p.system}}:{{p.position}}]</div>
            <div class="d-f-c j-c-c" style="height: 24px;">{{p.name}}</div>
          </td>

          <td>
            <div class="d-f-r j-c-c">
              <div>{{destCoords(p.fleetMission)}}</div>
            </div>
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