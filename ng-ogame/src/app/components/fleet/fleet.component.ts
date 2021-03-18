import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'og-fleet',
  template: `
    <section>
      <h1>Fleet</h1>

      <div class="centered">
          <button (click)="moveSmallCargoToPlanet()">
            Move cargo to planet
          </button>
          <button (click)="moveSmallCargoToMoon()">
            Move cargo to moon
          </button>
      </div>

    </section>
  `,
  styles: [
  ]
})
export class FleetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  private executeScript(script: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: script });
    });
  }

  moveSmallCargoToPlanet() {
    this.executeScript(`run('mp.fleetDispatcher.moveSmallCargoToPlanet()')`);
  }

  moveSmallCargoToMoon() {
    this.executeScript(`run('mp.fleetDispatcher.moveSmallCargoToMoon()')`);
  }
}
