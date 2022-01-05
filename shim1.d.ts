import { ProtocolWithReturn } from 'webext-bridge'

interface Window { mp: any; }
export declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-prev': { title: string | undefined }
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title: string }>
  }
}

declare global {
	interface Window {
        mp: MpOgame;
        currentPlanet: any;
	}
}