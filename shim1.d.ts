import { type MpOgame } from "./src/mp_ogame";

interface Window { mp: any; }

declare global {
	interface Window {
    mp: MpOgame;
    currentPlanet: any;
    fadeBox(text: string, isAlert: boolean): void;
	}
}