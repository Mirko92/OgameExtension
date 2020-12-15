import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'option';

  storage: any = {};

  keysOf(arg) {
    return Object.keys(arg);
  }

  constructor(
    private http: HttpClient,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initStorage();
    this.syncStorage();
  }

  getShipById(shipsData:any, id: number){
    return shipsData?.find(s => s.id === id) || {id};
  }

  private syncStorage(){
    let self = this;
    this._ngZone.runOutsideAngular(() => {
      chrome.storage.onChanged.addListener((changes) => {
        self._ngZone.run(() => self.storageListener(changes), self);
      });
    });
  }

  private storageListener(changes) {
    console.debug("Changes", changes);

    for (var key in changes) {
      this.storage[key] = changes[key]?.newValue;
      this.storage = { ...this.storage };
    }
  }

  initStorage() {
    // TODO: Alternale le due tramite l'environment ? 
    if (chrome.storage) {
      // Chiamata reale fattile solo in context dell'estensione
      const promise = new Promise((resolve) => {
        chrome.storage?.local.get(null, resolve);
      });

      promise.then(r => {
        console.debug("r", r);
        this.storage = r;
      });
    } else {
      // Mockup
      console.warn("USING MOCKUP");
      this.http.get<any>('/assets/data.json').subscribe(r => this.storage = r);
    }

  }
}
