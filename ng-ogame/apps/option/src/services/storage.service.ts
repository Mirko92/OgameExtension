import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageChanges: EventEmitter<any> = new EventEmitter();

  storage: any = {};

  constructor(
    private http: HttpClient,
    private _ngZone: NgZone) {
    this.initStorage();
    this.syncStorage();
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

  private syncStorage() {
    let self = this;
    this._ngZone.runOutsideAngular(() => {
      chrome.storage.onChanged.addListener((changes) => {
        self._ngZone.run(() => self.storageChanges.emit(changes), self);
      });
    });
  }
}
