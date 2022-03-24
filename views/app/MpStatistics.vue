<template>
    <div>
        <DoughnutChart :chartData = "data" :options = "chartOptions" />
    </div>
</template>

<script lang = "ts" setup>
import { useDbStore } from './store'
import { DoughnutChart } from 'vue-chart-3'
import {
    Chart,
    DoughnutController,
    ArcElement,
    Legend,
    Tooltip,
} from "chart.js"
import { storeToRefs } from 'pinia';
Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

const dbStore = useDbStore()
const { resourcesMap }  = storeToRefs(dbStore)

const data = computed(() => {
    return {
        labels: [
            'Metallo [K]',
            'Cristallo [K]',
            'Detuerio [K]',
            'Materia Oscura'
        ],
        datasets: [{
            label: 'Expeditions result',
            data : [
                (resourcesMap.value.metal        || 0) / 1e3,
                (resourcesMap.value.crystal      || 0) / 1e3,
                (resourcesMap.value.deuterium    || 0) / 1e3,
                resourcesMap.value.darkmatter    || 0,
            ],
            backgroundColor: [
                'rgb(253 119 5)',
                'rgb(115 221 255)',
                'rgb(5 253 188)',
                'rgb(4 4 4)',
            ],
            hoverOffset: 12,
            spacing    : 9,
        }]
    }
})

const chartOptions = {
    cutout   : "50%",
    animation: {
          animateScale: true
        }, layout     : {
        padding: 20
    },
}

onMounted(async () => {
    dbStore.init()
})
</script>