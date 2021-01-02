export class MpGalaxy {
    observer; 

    constructor(){}

    init(){
        this._addEspionageButton();
        this._observeGalaxyChanges();
    }

    _addEspionageButton() {
        if (document.getElementById('inatictiveEspionage')) return;

        const legendIcon = document.querySelector('#galaxytable thead tr.info_header th:first-child #probes');

        if (!legendIcon) {
            return setTimeout(() => {
                mp.addEspionageButton();
            }, 500);
        }

        legendIcon?.insertAdjacentHTML('afterend', `
            <span   id="inatictiveEspionage"
                    class="icon icon_eye mp_pointer" 
                    style="float: left; margin-left:5px;"
                    title="Inactives espionage"
                    onclick="mp.runInactiveEspionage()" >
            </span>`
        );
    }

    // TODO: Create UtilsClass 
    _observeGalaxyChanges() {
        const config = { attributes: true, childList: true, subtree: true };

        this.observer = new MutationObserver(() => {
            this._addEspionageButton();
        });

        this.observer.observe(document.getElementById('galaxyContent'), config);
    }
}