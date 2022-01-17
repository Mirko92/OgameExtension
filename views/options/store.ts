import { defineStore } from "pinia"

export const useStore = defineStore('options_store', () => {
  const storage = ref<OgameStorage>()

  const filters = ref<{
    [uni: string]: { 
      type: 1|3|null; 
      planetName?: string; 
    }
  }>({});

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
    s.ogameData?.forEach((uni: any) => {
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

  function initFilters(s: any) {
    s.ogameData.forEach((u: any) => {
      filters.value[u.code] = { type: null}
    })
  }

  function uni(code: string) {
    return storage.value?.ogameData?.find(u=> u.code === code)
  }

  function planetsOf(code: string) {
    const f = filters.value[code];
  
    return uni(code)?.planets.filter(p => !f?.type || p.type === f.type ) || []
  }

  async function init() {
    console.debug("Store INIT")

    if (chrome.storage) {
      console.info("Chrome storage is available")

      const s = await getFullStorage()
      sortStorage(s)
      initFilters(s)
      syncStorage()

      storage.value = s
      console.debug("Storage: ", storage)
      return s;
    } else {
      console.warn('No storage available, using mockup')

      const s = await (await fetch(`/assets/data_v1.json`)).json()
      sortStorage(s)
      initFilters(s)
      storage.value = s
      console.debug("storage", storage.value);
      return s;
    }
  }

  return {
    storage,
    filters, 
    init,
    planetsOf
  }
})