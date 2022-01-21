import { type MpOgame } from "./src/mp_ogame";

declare global {
    declare const playerName: string;
    declare const ogameUrl: string
    
    declare const resourcesBar : any;
    declare const metalOnPlanet     : any;
    declare const crystalOnPlanet   : any;
    declare const deuteriumOnPlanet : any;
    declare const shipsOnPlanet     : Ship[];
    declare function fadeBox(text: string, isAlert: boolean) : void;

    declare function $(...args: any[]): any;
	interface Window {
        mp: MpOgame;

        currentPlanet: any;
        
        fadeBox(text: string, isAlert: boolean): void;
	}
}