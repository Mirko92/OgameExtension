/**
 * Rappresenzatione dello storage locale di Chrome
 * key => Universe code -> Eg: s170-it
 */
export class Storage {
    ogameData: { [key: string]: OgameData };
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

    planets: OgamePlanet[];

    /* TODO: Si potrebbe aggiungere "playerName" */
}


/**
 * Planet/Moon data 
 */
export class OgamePlanet {
    name: string;
    type: PlanetType;

    galaxy: number;
    system: number;
    position: number;

    shipsData: any; //TODO: Tipizzare

    fleetMission: any;
}

/**
 * Destination type:
 * - Moon
 * - Panet
 * - Debris
 */
export enum PlanetType {
    PLANET = 1,
    DEBRIS = 2,
    MOON = 3
}

export enum Mission {
    ATTACK = 1,
    UNIONATTACK = 2,
    TRANSPORT = 3,
    DEPLOY = 4,
    HOLD = 5,
    ESPIONAGE = 6,
    COLONIZE = 7,
    RECYCLE = 8,
    DESTROY = 9,
    MISSILEATTACK = 10,
    EXPEDITION = 15
}