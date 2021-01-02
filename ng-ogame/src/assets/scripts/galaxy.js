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
                    title="Inactives espionage">
            </span>`
        );

        document.getElementById("inatictiveEspionage")
        .addEventListener('click', this.runInactiveEspionage);
    }

    // TODO: Create UtilsClass 
    _observeGalaxyChanges() {
        const config = { attributes: true, childList: true, subtree: true };

        this.observer = new MutationObserver(() => {
            this._addEspionageButton();
        });

        this.observer.observe(document.getElementById('galaxyContent'), config);
    }

    runInactiveEspionage() {
        console.debug("Run inactive espionage fn");
        let delay = 0;
        let step = 1000;

        return new Promise((resolve) => {
            let completed = 0;
            const elements = document.querySelectorAll('#galaxytable tr.inactive_filter td.action a.espionage');

            if (!elements?.length) resolve();

            elements.forEach(
                x => {
                    setTimeout(() => {
                        x.click();
                        completed++;

                        if (completed === elements.length) {
                            console.debug("Inactive espionage in this system completed");
                            resolve(true);
                        }
                    }, delay);

                    delay += step;
                }
            );
        });
    }
}