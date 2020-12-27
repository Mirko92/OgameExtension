import { HttpClient } from '@angular/common/http';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { OgamePlanet, OgameStorage } from 'model/OgameStorage';
import { from } from 'rxjs';
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

  get ogameData() {
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
    let storage$ = null;

    if (chrome.storage) {
      storage$ = from(this.storageSVC.getFullStorage());
    } else {
      // Mockup
      console.warn("USING MOCKUP");
      storage$ = this.http.get<any>('/assets/data.json');
    }

    storage$.subscribe(storage => {
      storage.ogameData.sort((x, y) => x.code.localeCompare(y.code));

      storage.ogameData.forEach(uni => {
        uni.planets.sort((p1, p2) => {
          const p1Coords = Number.parseInt(`${p1.galaxy}${p1.system}${p1.system}${p1.type}`);
          const p2Coords = Number.parseInt(`${p2.galaxy}${p2.system}${p2.system}${p2.type}`);
          return p1Coords - p2Coords;
        });
      });

      this.storage = storage;
    });
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
