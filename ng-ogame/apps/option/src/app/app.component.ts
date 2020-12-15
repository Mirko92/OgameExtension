import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Mission, PlanetType } from 'model/OgameStorage';
import { StorageService } from '../services/storage.service';
declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  /**
   * TODO: Spostare (potresti vedere surgeries per qualche idea)
   */
  storage: any = {};


  /**
   * Destination galaxy 1/10
   */
  galaxy: number;

  /**
   * Destination system 1/499
   */
  system: number;

  /**
   * Destination position 1/16 
   */
  position: number;

  /**
   * Destination type: Debris, Moon, Planet
   */
  type: PlanetType;

  /**
   * Selected mission
   */
  mission: Mission;

  /**
   * Percentage selected
   */
  velocity: number;

  /**
   * Utility: return keys array of an object 
   */
  keysOf(arg) {
    return Object.keys(arg);
  }

  /**
   * Passa value and icon of a single ship
   */
  getShipById(shipsData:any, id: number){
    return shipsData?.find(s => s.id === id) || {id};
  }

  constructor(
    private http: HttpClient,
    private storageSVC: StorageService
  ) {}

  ngOnInit(): void {
    this.storageSVC.storageChanges.subscribe(
      (changes)=>{
        for (var key in changes) {
          this.storage[key] = changes[key]?.newValue;
          this.storage = { ...this.storage };
        }
      }
    )

    this.initStorage();
  }

  initStorage() {
    // TODO: Alternale le due tramite l'environment ? 
    if (chrome.storage) {
      this.storageSVC.getFullStorage().then(r => {
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
