<template>
    <div>
        <div>
            <div class="tabs">
                <section 
                    class="tab"
                    :class="{ 'tab--active' : currentFilter === 'day' }" 
                    title="GIORNO" 
                    @click="onDayClick">
                    <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                    GIORNO
                </section>
                <section 
                    class="tab" 
                    :class="{ 'tab--active' : currentFilter === 'week' }" 
                    title="SETTIMANA" 
                    @click="onWeekClick">
                    <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                    SETTIMANA
                </section>
                <section 
                    class="tab" 
                    :class="{ 'tab--active' : currentFilter === 'month' }" 
                    title="MESE" 
                    @click="onMonthClick">
                    <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M19,4h-1V2h-2v2H8V2H6v2H5C3.89,4,3.01,4.9,3.01,6L3,20c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,20 H5V10h14V20z M9,14H7v-2h2V14z M13,14h-2v-2h2V14z M17,14h-2v-2h2V14z M9,18H7v-2h2V18z M13,18h-2v-2h2V18z M17,18h-2v-2h2V18z"/></g></svg>
                    MESE
                </section>
                <section 
                    class="tab" 
                    :class="{ 'tab--active' : currentFilter === 'year' }" 
                    title="ANNO" 
                    @click="onYearClick">
                    <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"/></svg>
                    ANNO
                </section>
            </div>
        </div>
        <div class="d-f-r j-c-c" v-if="firstDate && lastDate">
            <div class="mr1">
                <span>
                    Dal: {{firstDate}}
                </span>
            </div>

            <div>
                <span>
                    Al: {{lastDate}}
                </span>
            </div>
        </div>


        <div class="d-f-r f-w j-c-a a-i-c">
            <div style="min-width: 400px;">
                <DoughnutChart  :chartData="data" 
                                :options="chartOptions" />
            </div>
    
            
            <ul class="exp_ships">
                <li v-for="key of fleetKeys">
                    <div class="exp_ship">
                        <span   class="exp_ship__name">
                            {{key}}
                        </span>
                        <span class="exp_ship__qty">
                            {{formatNumber(fleet[key])}}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="d-f-r j-c-b f-w">
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
const { fleet, resourcesMap, count: expeditionsCount, firstDate, lastDate }  = storeToRefs(dbStore)

const darkMatter = computed(() => resourcesMap.value?.darkmatter) 

const fleetKeys = computed(() => fleet.value && Object.keys(fleet.value).sort()) 

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

const currentFilter = ref<'day' | 'week' | 'month' | 'year'>('day')

function getStartEndOfTheWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay(); // 👉️ get day of week

    const startDiff = date.getDate() - day + (day === 0 ? -6 : 1);
    const endDiff = date.getDate() - day + 7;

  return [
      new Date((new Date()).setDate(startDiff)),
      new Date((new Date()).setDate(endDiff)),
  ];
}

function getStartEndOfTheMonth(date: Date) {
  return [
      new Date(date.getFullYear(), date.getMonth(), 1),
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
  ];
}

function getStartEndOfTheYear(date: Date) {
  return [
      new Date(date.getFullYear(), 0, 1),
      new Date(date.getFullYear(), 12, 0),
  ];
}

function onDayClick() {
    currentFilter.value = 'day'
    dbStore.loadData()
}

function onWeekClick() {
    currentFilter.value = 'week'
    const [start, end ] = getStartEndOfTheWeek(new Date())
    dbStore.loadData(start, end)
}

function onMonthClick() {
    currentFilter.value = 'month'
    const [start, end ] = getStartEndOfTheMonth(new Date())
    dbStore.loadData(start, end)
}

function onYearClick() {
    currentFilter.value = 'year'
    const [start, end ] = getStartEndOfTheYear(new Date())
    dbStore.loadData(start, end)
}

function formatNumber(num: number) {
    return num?.toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

onMounted(async () => {
    dbStore.init()
})
</script>
