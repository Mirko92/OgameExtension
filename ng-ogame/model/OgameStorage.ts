/**
 * Rappresenzatione dello storage locale di Chrome
 * key => Universe code -> Eg: s170-it
 */
export class Storage{
    ogameData: {[key:string]: OgameData};
}

/**
 * Dati di un singolo universo
 */
export class OgameData {
    /**
     * Eg: s170-it
     */
    universeCode: string; 

    /**
     * Eg: Rosalind, Sombrero...
     */
    universeName: string; 

    planets : OgamePlanet[];

    /* TODO: Si potrebbe aggiungere "playerName" */
}


/**
 * Dati di un singolo pianeta
 */
export class OgamePlanet {
    name:string;
    type: PlanetType;

    galaxy:number; 
    system:number; 
    position:number; 

    shipsData: any; //TODO: Tipizzare
}

/**
 * Tipologia di pianeta
 */
export enum PlanetType {
    PLANET= 1,
    DEBRIS= 2,
    MOON= 3
}