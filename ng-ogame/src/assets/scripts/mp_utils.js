import {
    MP_PLANET_TYPES,
} from './consts.js';

export function server() {
    return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1];
}

export function goTo(planetId, component) {
    location.replace(`https://${server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=${component}`);
}

export function currentPlanetId() {
    let result = null;

    // TODO: Funziona solo in fleetDispatch credo
    if (currentPlanet.type === MP_PLANET_TYPES.MOON) {
        const currentMoonEl = document.querySelector(".hightlightMoon a.moonlink");
        const moonUrl = currentMoonEl.getAttribute("href");

        var searchParams = new URLSearchParams(moonUrl);
        result = searchParams.get('cp');
    } else {
        const currentPlanetEl = document.querySelector(".hightlightPlanet");
        result = currentPlanetEl.getAttribute('id').replace("planet-");
    }

    if (result) {
        return result;
    } else {
        throw "Current planet id not found";
    }

}