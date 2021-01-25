export function server() {
    return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1];
}

export function goTo(planetId, component) {
    location.replace(`https://${server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=${component}`);
}