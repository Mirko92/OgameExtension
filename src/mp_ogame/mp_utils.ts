/**
 * Extracts server code from web url 
 */
export function server() {
    return new RegExp(".*//(.*).ogame.gameforge.com.*").exec(location.href)![1];
}

/**
 * Navigate to a specific Planet's component
 * @param planetId destination planet ID
 * @param component Ogame Component
 */
export function goTo(planetId: string, component: string) {
    location.replace(
        `https://${server()}.ogame.gameforge.com/game/index.php?page=ingame&cp=${planetId}&component=${component}`
    );
}

/**
 * Return collection of planets id 
 * @returns 
 */
export function planetIds() {
    const planetEls = document.querySelectorAll('a.planetlink, a.moonlink') as any as Array<Element>;
    return [...planetEls]
        .map(l => (new URLSearchParams(l.getAttribute("href")!)).get('cp')!);
}

/**
 * Return chrome extension id 
 */
export function extensionId() {
    return localStorage.getItem('mp_ogame_ext_id');
} 