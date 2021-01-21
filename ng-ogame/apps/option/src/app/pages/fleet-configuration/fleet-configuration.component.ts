import { Component } from '@angular/core';
import { StorageService } from 'apps/option/src/services/storage.service';
import { OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'og-fleet-configuration',
  templateUrl: './fleet-configuration.component.html',
  styleUrls: ['./fleet-configuration.component.less']
})
export class FleetConfigurationComponent {
  get storage() {
    return this.storageSVC.storage;
  };

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
    private storageSVC: StorageService
  ) { }


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
