/**
 * Rappresenzatione dello storage locale di Chrome
 */
export class Storage{
    ogameData: OgameData[];
}

/**
 * Dati di un singolo universo
 */
export class OgameData {
    /**
     * Eg: s170-it
     */
    uni: string; 

    planets : OgamePlanet;

    /* TODO: Si potrebbe aggiungere "playerName" */
}


/**
 * Dati di un singolo pianeta
 */
export class OgamePlanet {
    coords: {galaxy:number; system:number; position:number; type: PlanetType};

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