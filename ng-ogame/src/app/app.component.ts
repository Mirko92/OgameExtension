import { Component, NgZone, OnInit } from '@angular/core';

declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'ogame-ext';

  currentComponent: string = null;

  get version() {
    return chrome.runtime.getManifest().version;
  }

  constructor(private _ngZone: NgZone) { }

  ngOnInit() {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        const url = tabs[0]?.url;

        if (url) {
          const searchParams = new URLSearchParams(url);
          let component = searchParams.get('component').split('#')[0];

          this._ngZone.run(() => this.currentComponent = component);
        }
      });
  }

  goToOptions() {
    chrome.runtime.openOptionsPage();
  }

  private executeScript(script: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: script });
    });
  }

  keepMeOn(){
    this.executeScript(`run('mp.keepMeOn()')`);
  }
  updateFleets(){
    this.executeScript(`run('mp.updateFleets()')`);
  }
  fleetSave(){
    this.executeScript(`run('mp.automaticFleetSave()')`);
  }
  moveToPlanet(){
    this.executeScript(`run('mp.moveToPlanet()')`);
  }
  moveToMoon(){
    this.executeScript(`run('mp.moveToMoon()')`);
  }
  

  destination: string; 
  collect(){
    this.executeScript(`run('mp.collectToMain(null, \\'${this.destination}\\')')`);
  }

  STOP(){
    this.executeScript(`run('mp.clearMissions()')`);
  }

  sendExpeditions(){
    this.executeScript(`run('mp.sendExpeditions(null, \\'${this.destination}\\')')`);
  }

}
