export function server() {
    return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)[1];
}

export function goTo(planetId, component) {
    location.replace(`https://${server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=${component}`);
}

export function planetIds() {
    return [...document.querySelectorAll('a.planetlink, a.moonlink')].map(l => {

        let url = l.getAttribute("href");

        var searchParams = new URLSearchParams(url);

        return searchParams.get('cp');

    });
}