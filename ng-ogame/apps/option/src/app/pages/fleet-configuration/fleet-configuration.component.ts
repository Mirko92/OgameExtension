import { Component } from '@angular/core';
import { StorageService } from 'apps/option/src/services/storage.service';
import { OgameData, OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'og-fleet-configuration',
  templateUrl: './fleet-configuration.component.html',
  styleUrls: ['./fleet-configuration.component.less']
})
export class FleetConfigurationComponent {
  constructor(
    private storageSVC: StorageService
  ) { }

  get storage() {
    return this.storageSVC.storage;
  };

  get ogameData() {
    return this.storage?.ogameData;
  }

  getMissionFor(p: OgamePlanet, u : OgameData){
    return u.missions?.find(m => m.planetId === p.id);
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
