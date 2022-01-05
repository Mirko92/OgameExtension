export class MpGalaxy {
    observer; 

    constructor(){}

    init(){
        // this._removeTooltips();
        this._addEspionageButton();
        this._observeGalaxyChanges();
    }

    // _removeTooltips() {
        
    // }

    _addEspionageButton() {
        if (document.getElementById('inatictiveEspionage')) return;

        const galaxyHeader = document.querySelector('#galaxyHeader form > span')

        if (!galaxyHeader) {
            return setTimeout(() => {
                this._addEspionageButton();
            }, 500);
        }

        galaxyHeader?.insertAdjacentHTML('beforebegin', `
            <span   id="inatictiveEspionage"
                    class="icon icon_eye" 
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

            const elements = 
                document.querySelectorAll(
                    '.galaxyTable .galaxyRow.inactive_filter > .galaxyCell.cellAction > a.espionage'
                );

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