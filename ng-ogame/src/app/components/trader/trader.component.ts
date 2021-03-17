import { Component } from '@angular/core';

@Component({
  selector: 'og-trader',
  template: `
  <div class="trader">
          <header>
            <h1>Trader</h1>
          </header>
          <section class="trader__form">

            <div class="form-group">
              <label for="max-bet">Max bet</label>
              <input id="max-bet"
                     type="number"
                     [(ngModel)]="maxBet">
            </div>

            <div class="actions">
              <button (click)="runBot()">
                RUN
              </button>

              <button (click)="stop()">
                STOP
              </button>

              <button (click)="bet()">
                BET
              </button>
            </div>
          </section>

        </div>
  `,
})
export class TraderComponent {
  maxBet: number = 5000;

  private executeScript(script: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: script });
    });
  }

  runBot() {
    this.executeScript(`bot(${this.maxBet});`);
  }

  stop() {
    this.executeScript(`stop();`);
  }

  bet() {
    this.executeScript('betMetal();');
  }

}
