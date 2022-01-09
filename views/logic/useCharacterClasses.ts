export function useCharacterClasses() {

    function characterClass(character: string) {
        return document.querySelector('#characterclass .characterclass')
            ?.classList.contains(character) || false;
    }

    function isExplorer() {
        return characterClass('explorer')
    }

    function isWarrior() {
        return characterClass('warrior')
    }

    function isMiner() {
        return characterClass('miner');
    }

    return {
        isExplorer,
        isWarrior,
        isMiner
    }
}