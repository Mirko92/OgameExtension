<template>
    <div>
        <DoughnutChart :chartData = "data" :options = "chartOptions" />
    </div>
</template>

<script lang = "ts" setup>
import { DoughnutChart } from 'vue-chart-3'
import {
    Chart,
    DoughnutController,
    ArcElement,
    Legend,
    Tooltip,
} from "chart.js"
Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

const databaseName = "OGAME"
const queryDate    = (new Date()).toISOString().slice(0, 10)
const database     = ref<IDBDatabase>()

function extractExpeditionResult(text: string) {
    var r = /(Cristallo|Metallo|Deuterio)\s(.*)\s(è stato razziato\.)/mg.exec(text);

    if (!r) {
        r = /(Materia Oscura)\s((\d{1,3}\.)?\d{1,3})\s(è stato razziato\.)/mgi.exec(text);
    }

    if (!r) return {};

    const resourcesKeys: Record<string, string> = {
        'Metallo'       : 'metal',
        'Cristallo'     : 'crystal',
        'Deuterio'      : 'deuterium',
        'Materia Oscura': 'darkmatter',
    }

    var resource = resourcesKeys[r[1]];
    var amount   = +(r?.[2]?.replaceAll('.', '') || 0);

    if (resource) {
        return { resource, amount };
    }

    return {};
}

function getStore(store_name: string, mode: IDBTransactionMode) {
    if (database.value) {
        const tx = database.value.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }
}

function getMessages(type: string, date: string): Promise<any[]> {
    const store = getStore("MESSAGES", 'readonly');

    if (!store) return Promise.resolve([]);

    let indexName = "by_type_date";

    if (type && date || (!type && !date)) {
        indexName = "by_type_date";
    } else if (type) {
        indexName = "by_type";
    } else if (date) {
        indexName = "by_date";
    }

    const key = (type || date) ? [type, date].filter(x => x) : null;

    const index   = store.index(indexName);
    const request = index.getAll(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = (event: Event) => {
            resolve(event.target!.result);
        }

        request.onerror = (e) => {
            reject(e);
        }
    });

}

function connectToDB() {
    return new Promise( (resolve, reject) => {
        const request         = window.indexedDB.open(databaseName, 1)
              request.onerror = (error) => {
            console.error(error)
            reject(error)
        }
        request.onblocked = (cause) => {
            console.debug("Blocked event", cause)
            console.log("Please close all other tabs with this site open!")
            reject(cause)
        }
        request.onsuccess = () => {
            database.value = request.result;
            resolve(database.value);
        }
    })
}

const resourcesMap = ref<Record<string, number>>({})
function loadData() {
          resourcesMap.value = {}
    const mr                 = resourcesMap.value;
    getMessages("EXPEDITION", queryDate)
        .then(x => {
            console.log("Data spedizione: ", queryDate)
            console.log("N° Spedizioni: %s", x.length);

            x.forEach(s => {
                const {
                    resource, amount
                } = extractExpeditionResult(s.text);

                if (resource) {
                    mr[resource] = 
                        mr[resource]
                            ? mr[resource] += amount
                            :  amount;
                }
            });
            console.log("Risorse: ", mr);
        });
}

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
    await connectToDB()
    loadData();
})
</script>