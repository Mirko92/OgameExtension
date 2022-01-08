import { defineStore } from "pinia"

export const useStore = defineStore('options_store', () => {

  const storage = ref()

  function getFullStorage(): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage?.local.get(null, resolve)
    });
  }

  function sortStorage(s: any) {
    // Sort by Universe Code
    s.ogameData?.sort(
      (x: any, y: any) => (x.code as string).localeCompare(y.code)
    );

    // Sort planets by coords and type 
    s.ogameData.forEach((uni: any) => {
      uni.planets?.sort((p1: any, p2: any) => {
        const p1Coords = Number.parseInt(`${p1.galaxy}${p1.system.toString().padStart(3, '0')}${p1.position.toString().padStart(2, '0')}${p1.type}`);
        const p2Coords = Number.parseInt(`${p2.galaxy}${p2.system.toString().padStart(3, '0')}${p2.position.toString().padStart(2, '0')}${p2.type}`);
        return p1Coords - p2Coords;
      });
    });
  }

  function syncStorage() {
    chrome.storage.onChanged.addListener((changes) => {
      for (var key in changes) {
        const oldStorage = {...storage.value};
        oldStorage[key] = changes[key]?.newValue;

        sortStorage(oldStorage);
        
        storage.value = { ...oldStorage };
      }
    });
  }

  async function init() {

    if (chrome.storage) {
      const s = await getFullStorage()
      // sortStorage(s) TODO: questa riga non funziona perché non riesce a fare il sort sull'oggetto
      storage.value = s
      syncStorage()
    } else {
      console.warn('No storage available, using mockup')

      storage.value = await (await fetch(`/assets/data_v1.json`)).json()

      console.debug("storage", storage.value);
    }
  }

  return {
    storage,
    init
  }
})