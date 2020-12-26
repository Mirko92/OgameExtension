import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OgamePlanet, OgameStorage } from 'model/OgameStorage';
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
  storage: OgameStorage = {};

  get ogameData(){
    return this.storage?.ogameData;
  }

  /**
   * Passa value and icon of a single ship
   */
  getShipById(shipsData: any, id: number) {
    return shipsData?.find(s => s.id === id) || { id };
  }

  constructor(
    private http: HttpClient,
    private storageSVC: StorageService
  ) { }

  ngOnInit(): void {
    this.storageSVC.storageChanges.subscribe(
      (changes) => {
        for (var key in changes) {
          this.storage[key] = changes[key]?.newValue;
          this.storage = { ...this.storage };
        }
      }
    )

    this.initStorage();
  }

  initStorage() {
    // TODO: Alterna le le due tramite l'environment ? 
    if (chrome.storage) {
      this.storageSVC.getFullStorage().then(storage => {
        this.storage = storage;
      });
    } else {
      // Mockup
      console.warn("USING MOCKUP");
      this.http.get<any>('/assets/data.json').subscribe(r => this.storage = r);
    }
  }

  setFleetMissionKey(p: OgamePlanet, key: string, value) {
    p.fleetMission = { ...(p.fleetMission || {}), [key]: value }
  }

  saveFleetMission(uni: string, p: OgamePlanet) {
    chrome.runtime.sendMessage(chrome.runtime.id,
      {
        method: "SAVE_FLEET_INFO",
        data: { uni, planet: p, shipsData: p.shipsData }
      }
    );
  }
}
