<template>
    <div>
        <!-- <div class="d-f-r j-c-a">
            <div>
                <label for="since_date">
                    Dal:
                </label>
                <input id="since_date" type="date">
            </div>

            <div>
                <label for="till_date">
                    Al:
                </label>
                <input id="till_date" type="date">
            </div>
        </div> -->

        <DoughnutChart :chartData = "data" :options = "chartOptions" />

        <div class="d-f-r j-c-b">
            <pre>{{ t('chart.dark_matter') }}: {{darkMatter}}</pre>
            <pre>{{ t('chart.total_exp') }}: {{expeditionsCount}}</pre>
        </div>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

const dbStore = useDbStore()
const { resourcesMap, count: expeditionsCount }  = storeToRefs(dbStore)

const darkMatter = computed(() => resourcesMap.value?.darkmatter) 

const data = computed(() => {
    return {
        labels: [
            t('chart.legend.deuterium'),
            t('chart.legend.crystal'),
            t('chart.legend.metal'),
        ],
        datasets: [{
            label: 'Expeditions result',
            data : [
                (resourcesMap.value.deuterium    || 0) / 1e3,
                (resourcesMap.value.crystal      || 0) / 1e3,
                (resourcesMap.value.metal        || 0) / 1e3,
            ],
            backgroundColor: [
                'rgb(27, 196, 117)',
                'rgb(23, 154, 166)',
                'rgb(176, 48, 12)',
            ],
            borderColor:  'rgb(56, 52, 52)',
            hoverOffset: 12,
            spacing    : 10,
        }]
    }
})

const chartOptions = {
    animation: {
        animateScale: true
    }, 
    layout     : {
        padding: 20
    },
}

onMounted(async () => {
    dbStore.init()
})
</script>