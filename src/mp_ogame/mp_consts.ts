export const enum MP_MISSIONS {
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

export const enum MP_PLANET_TYPES {
    PLANET = 1,
    DEBRIS = 2,
    MOON   = 3
}

export const enum MP_LOCAL_STORAGE {
    FLEET_TOKEN  = "mp_fleet_token",
    MISSION      = "mp_mission",
    STOP_MISSION = "mp_stop_mission",
}