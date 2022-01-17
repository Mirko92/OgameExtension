/**
 * Chrome local storage type definition
 */
type OgameStorage = {
    [key: string]: any;
    ogameData?: Universe[];
};

/**
 * Ogame universe data type definition
 */
type Universe = {
    code: string;
    name: string;
    playerName: string;
    planets: Planet[];
    missions?: GenericMission[];
    expeditionConfig: ExpeditionConfig;
}

/**
 * Ogame planet data type definition
 */
type Planet = {
    id  : string;
    name: string;
    type: PlanetType;

    fleetMission: FleetMission;
    shipsData?: any; // TODO: Definire
}

/**
 * Ogame fleet mission data type definition
 * Actually, FleetSave Mission TODO: 
 */
type FleetMission = {
    enabled ?: boolean;
    galaxy  ?: string;
    mission ?: string;
    position?: string;
    system  ?: string;
    type    ?: MP_MISSIONS;
    velocity?: string;
}

type GenericMission = FleetMission & {
    planetId: string;
}

type ExpeditionConfig = any; //TODO: Definire

/**
 * Possible Ogame mission types
 */
const enum MP_MISSIONS {
    ATTACK       = 1,
    UNIONATTACK  = 2,
    TRANSPORT    = 3,
    DEPLOY       = 4,
    HOLD         = 5,
    ESPIONAGE    = 6,
    COLONIZE     = 7,
    RECYCLE      = 8,
    DESTROY      = 9,
    MISSILEATTACK= 10,
    EXPEDITION   = 15
}

type PlanetType = any; //TODO. definire

/**
 * Primary key for Ogame universe 
 */
type MpUniKey = {
    uni: string; 
}

/**
 * Primary keys to retrieve a single Planet from storage
 */
type MpPlanetKeys = {
    uni: string;
    planetId: string;
}

/**
 * To save and update a planet's fleet-save mission
 */
type MpPlanetMissionData =  MpPlanetKeys & {
    mission: FleetMission;
}

type MpSaveFleetInfoData = {
    uni: string;
    uniName: string;
    playerName: string;
    planet: Planet;
    shipsData: any[]; //TODO: define
}

type MpSaveManyFleetMissionsData = {
    uni: string;
    planets: {
        planetId: string;
        mission: FleetMission;
    }[];
}

type MpSaveMissionData = {
    uni: string;
    mission: GenericMission;
}

/**
 * Payload to save expeditions configuration
 */
type MpSaveExpeditionConfigData = {
    uni: string;
    expeditionConfig: ExpeditionConfig;
}


type MpSaveFleetInfo = {
    method: 'SAVE_FLEET_INFO';
    data: MpSaveFleetInfoData;
}

type MpSaveFleetMission = {
    method: 'SAVE_FLEETSAVE_MISSION',
    data: MpPlanetMissionData;
}

type MpSaveManyFleetMissions = {
    method: 'SAVE_MANY_FLEETSAVE_MISSIONS',
    data: MpSaveManyFleetMissionsData;
}

type MpGetFleetSave = {
    method: 'GET_FLEET_SAVE_DATA';
    data: MpPlanetKeys;
}

type MpSaveMission = {
    method: 'SAVE_MISSION';
    data: MpSaveMissionData;
}

type MpSaveExpeditionConfig = {
    method: 'SAVE_EXPEDITION_CONFIG';
    data: MpSaveExpeditionConfigData;
}

type MpGetExpeditionConfig = {
    method: 'GET_EXPEDITION_CONFIG';
    data: MpUniKey;
}

type MpOpenOptions = {
    method: 'OPEN_OPTIONS';
    data: null;
}

type MpRequest = MpSaveFleetInfo | MpSaveFleetMission | MpSaveManyFleetMissions | MpGetFleetSave | MpSaveMission | MpSaveExpeditionConfig | MpGetExpeditionConfig | MpOpenOptions; 