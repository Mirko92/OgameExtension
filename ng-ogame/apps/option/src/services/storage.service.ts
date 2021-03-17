import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { OgameStorage } from 'model/OgameStorage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly _storage = new BehaviorSubject<OgameStorage>({});

  public readonly storage$: Observable<OgameStorage> = this._storage.asObservable();

  get storage(): OgameStorage {
    return this._storage.getValue();
  }

  set storage(val: OgameStorage) {
    this._storage.next(val);
  }

  storageChanges: EventEmitter<any> = new EventEmitter();

  constructor(
    private http:     HttpClient,
    private _ngZone:  NgZone
  ) {

    this.initStorage();

    this.storageChanges.subscribe(
      (changes) => {
        for (var key in changes) {
          const oldStorage = {...this.storage};
          oldStorage[key] = changes[key]?.newValue;

          this.sortStorage(oldStorage);
          
          this.storage = { ...oldStorage };
        }
      }
    );
  }

  private sortStorage(storage){
    // Sort by Universe Code
    storage.ogameData?.sort((x, y) => x.code.localeCompare(y.code));

    // Sort planets by coords and type 
    storage.ogameData.forEach(uni => {
      uni.planets?.sort((p1, p2) => {
        const p1Coords = Number.parseInt(`${p1.galaxy}${p1.system.toString().padStart(3, '0')}${p1.position.toString().padStart(2, '0')}${p1.type}`);
        const p2Coords = Number.parseInt(`${p2.galaxy}${p2.system.toString().padStart(3, '0')}${p2.position.toString().padStart(2, '0')}${p2.type}`);
        return p1Coords - p2Coords;
      });
    });
  }

  getFullStorage(): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage?.local.get(null, resolve);
    });
  }

  /**
   * Copy storage to local variable 
   */
  initStorage() {
    let storage$: Observable<any> = null;

    if (chrome.storage) {
      storage$ = from(this.getFullStorage());
      this.syncStorage();
    } else {
      // Using mockup, to Ng Serve command, without chrome API
      console.warn("USING MOCKUP");
      storage$ = this.http.get<any>(`/assets/data_${environment.dataVersion}.json`);
    }

    let subs = storage$.subscribe(storage => {
      this.sortStorage(storage);

      this.storage = storage;
      subs.unsubscribe();
    });
  }

  /**
   * Listen to storage changes and apply them to local copy
   */
  private syncStorage() {
    let self = this;
    this._ngZone.runOutsideAngular(() => {
      chrome.storage.onChanged.addListener((changes) => {
        self._ngZone.run(() => self.storageChanges.emit(changes), self);
      });
    });
  }
}
