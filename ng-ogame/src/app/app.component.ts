import { Component, NgZone, OnInit } from '@angular/core';

declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'ogame-ext';

  maxBet: number = 5000;

  currentComponent: string = null;

  constructor(
    private _ngZone: NgZone) { }

  ngOnInit() {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        const url = tabs[0]?.url;

        if(url){
          const searchParams = new URLSearchParams(url);
          let component = searchParams.get('component').split('#')[0];
  
          this._ngZone.run(() => this.currentComponent = component);
        }
      });
  }

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
