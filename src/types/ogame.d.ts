type OgameStorage = {
    [key: string]: any;
    ogameData?: Universe[];
};

type Universe = {
    code: string;
    planets: Planet[];
}

type Planet = {
    id  : string;
    name: string;

    fleetMission?: FleetMission;
}

type FleetMission = {
    enabled : boolean;
    galaxy  : string;
    mission : string;
    position: string;
    system  : string;
    type    : MP_MISSIONS;
    velocity: string;
}

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

type MpSaveFleetInfoData = {
    uni: string;
    uniName: string;
    playerName: string;
    planet: Planet;
    shipsData: any[]; //TODO: define
}

type MpFleetSaveMissionData = {
    uni: string;
    planetId: string;
    mission: FleetMission;
}


type MpSaveFleetInfo = {
    method: 'SAVE_FLEET_INFO';
    data: MpSaveFleetInfoData;
}

type MpSaveFleetMission = {
    method: 'SAVE_FLEETSAVE_MISSION',
    data: MpFleetSaveMissionData;
}

type MpSaveManyFleetMissions = {
    method: 'SAVE_MANY_FLEETSAVE_MISSIONS',
    data: {
        uni: string;
        planets: {
            planetId: string;
            mission: FleetMission;
        }[];
    }
}

type MpGetFleetSaveData = {
    method: 'GET_FLEET_SAVE_DATA';
    data: {
        uni: string;
        planetId: string;
    }
}

type MpSaveMission = {
    method: 'SAVE_MISSION';
    data: {
        uni: string;
        planetId: string;
        mission: FleetMission; // TODO: Controllare 
    }
}

type MpSaveExpeditionConfig = {
    method: 'SAVE_EXPEDITION_CONFIG';
    data: {
        uni: string;
        planetId: string;
        mission: FleetMission;
    }
}

type MpGetExpeditionConfig = {
    method: 'GET_EXPEDITION_CONFIG';
    data: {
        uni: string;
        planetId: string;
    }
}

type MpOpenOptions = {
    method: 'OPEN_OPTIONS';
}

type MpRequest = MpSaveFleetInfo | MpSaveFleetMission | MpSaveManyFleetMissions | MpGetFleetSaveData | MpSaveMission | MpSaveExpeditionConfig | MpGetExpeditionConfig | MpOpenOptions; 