import { defineStore } from "pinia"
// TODO: Spostare questo in un file di configurazione
const DB_NAME    = "OGAME"
const DB_VERSION = 1

export const useDbStore = defineStore('db_store', () => {
  const queryDate = (new Date()).toISOString().slice(0, 10)
  const database  = ref<IDBDatabase>()

  function getMessages(type: string, date: string): Promise<any[]> {
    const store = getStore("MESSAGES", 'readonly')

    if (!store) return Promise.resolve([])

    let indexName = "by_type_date"

    if (type && date || (!type && !date)) {
      indexName = "by_type_date"
    } else if (type) {
      indexName = "by_type"
    } else if (date) {
      indexName = "by_date"
    }

    const key = (type && date) ? [type, date] : [type, date].filter(x => x).join("")

    const index   = store.index(indexName)
    const request = index.getAll(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        resolve(event.target!.result)
      }

      request.onerror = (e) => {
        reject(e)
      }
    })
  }

  function getStore(store_name: string, mode: IDBTransactionMode) {
    if (database.value) {
      const tx = database.value.transaction(store_name, mode)
      return tx.objectStore(store_name)
    }
  }

  function connectToDB() {
    return new Promise((resolve, reject) => {
      const request         = window.indexedDB.open(DB_NAME, DB_VERSION)
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
        database.value = request.result
        resolve(database.value)
      }
    })
  }

  const filters = ref<{
    date?: string
  }>({})

  const count = ref(0)
  const resourcesMap = ref<Record<string, number>>({})

  async function loadData() {
    const messages = await getMessages("EXPEDITION", queryDate)
    calcResourcesFromMessages(messages)
  }

  function calcResourcesFromMessages(messages: Message[]) {
    resourcesMap.value = {}
    count.value = messages.length

    const mr = resourcesMap.value
    messages.forEach(s => {
      const {
        resource, amount
      } = parseExpTextMessage(s.text)

      if (resource) {
        mr[resource] = 
          mr[resource]
            ? mr[resource] += amount
            :  amount
      }
    })
  }

  async function init() {
    console.debug("DB Store INIT")

    if (import.meta.env.DEV) {
      console.debug("DEV MODE")
      const messages: Message[] = await (await fetch(`/dist/data/db_2022-03-23.json`)).json()
      
      calcResourcesFromMessages(messages?.filter(m => m.type === "EXPEDITION"))
    } else {
      await connectToDB()
      loadData()
    }
  }

  return {
    count,
    resourcesMap,
    filters,
    init,
  }
})

function parseExpTextMessage(text: string) {
  var r = /(Cristallo|Metallo|Deuterio)\s(.*)\s(è stato razziato\.)/mg.exec(text)

  if (!r) {
    r = /(Materia Oscura)\s((\d{1,3}\.)?\d{1,3})\s(è stato razziato\.)/mgi.exec(text)
  }

  if (!r) return {}

  const resourcesKeys: Record<string, string> = {
    'Metallo'       : 'metal',
    'Cristallo'     : 'crystal',
    'Deuterio'      : 'deuterium',
    'Materia Oscura': 'darkmatter',
  }

  var resource = resourcesKeys[r[1]]
  var amount   = +(r?.[2]?.replaceAll('.', '') || 0)

  if (resource) {
    return { resource, amount }
  }

  return {}
}