import { defineStore } from "pinia"
// TODO: Spostare questo in un file di configurazione
const DB_NAME    = "OGAME"
const DB_VERSION = 1

export const useDbStore = defineStore('db_store', () => {
  const database  = ref<IDBDatabase>()

  const firstDate = ref('')
  const lastDate  = ref('')

  async function loadData(date?: Date, dateEnd?: Date) {
    date ??= (new Date())

    const  [start, end] = [date, dateEnd]
      .filter( d => d)
      .map(d => d!.toISOString().slice(0, 10))

    const messages = await loadByDate("EXPEDITION", start, end)

    firstDate.value = messages[0]?.date
    lastDate.value  = messages[messages.length - 1]?.date

    calcResourcesFromMessages(messages)
  }

  function loadByDate(type: MessageType, since: string, to?: string) {

    if (!to || since === to) {
      return getMessages(type, since)
    }

    const request = getStore("MESSAGES", 'readonly')
      .index("by_type_date")
      .openCursor(
        IDBKeyRange.bound(
          [type, since],
          [type, to],
        )
      )

      return new Promise<Message[]>((resolve, reject) => {
        const result: Message[] = []

        request.onsuccess = (e: Event) => {
          const r = e.target!.result
  
          if (r) {
            result.push(r.value)
            r.continue();
          } else {
            console.log("Result", result)
            resolve(result)
          }
        }
  
        request.onerror = (e) => {
          reject(e)
        }
      })
  }

  function getMessages(type: MessageType, date: string): Promise<Message[]> {
    const request = getStore("MESSAGES", 'readonly')
      .index(chooseIndex(type, date))
      .getAll(
        (type && date)
          ? [type, date]
          :  type || date
      );

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        resolve(event.target!.result)
      }

      request.onerror = (e) => {
        reject(e)
      }
    })
  }

  function getStore(store_name: string, mode: IDBTransactionMode): IDBObjectStore {
    const tx = database.value!.transaction(store_name, mode)
    return tx.objectStore(store_name)
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

  function calcResourcesFromMessages(messages: Message[]) {
    resourcesMap.value = {}
    fleet.value        = {}
    count.value        = messages.length

    const mr = resourcesMap.value
    messages.forEach(s => {
      const {
        resource, amount, ships
      } = parseExpTextMessage(s.text)

      if (resource) {
        mr[resource] = 
          mr[resource]
            ? mr[resource] += amount
            :  amount
      } else if (ships) {
        fleet.value ??= {} 

        Object.keys(ships).forEach(k => {
          fleet.value[k] = (fleet.value[k] || 0) + ships[k]
        })
        
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

  const count        = ref(0)
  const resourcesMap = ref<Record<string, number>>({})
  const fleet = ref()

  return {
    firstDate,
    lastDate,
    count,
    resourcesMap,
    fleet,
    init,
    loadData
  }
})



function chooseIndex(type: string, date: string) {
  let indexName = "by_type_date";

  if (type && date || (!type && !date)) {
    indexName = "by_type_date";
  } else if (type) {
    indexName = "by_type";
  } else if (date) {
    indexName = "by_date";
  }

  return indexName;
}

function parseExpTextMessage(text: string) {
  var r = /(Cristallo|Metallo|Deuterio)\s(.*)\s(è stato razziato\.)/mg.exec(text)

  if (!r) {
    r = /(Materia Oscura)\s((\d{1,3}\.)?\d{1,3})\s(è stato razziato\.)/mgi.exec(text)
  }

  if (text.includes('sono ora parte della flotta:')) {
    const ships = [...text.matchAll(/[a-zA-Z ]+:\s\d+/gm)].flat()
      .reduce(
        (a: Record<string, number>, s: string) => {
          const [key, value] = s.split(':')
          a[key] = Number.parseInt(value)
          return a;
        }, {}
      )

    return { ships }
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