import { Component, Input } from '@angular/core';
import { OgameMission, OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'og-planet',
  templateUrl: './ogame-planet.component.html',
  styleUrls: ['./ogame-planet.component.less']
})
export class OgamePlanetComponent {
  @Input()
  uni: string;

  @Input()
  planet: OgamePlanet;

  @Input()
  mission: OgameMission = {};

  saveMission() {
    this.mission.planetId = this.planet.id;
    this.mission.missionCode = "fleet-mission";

    chrome.runtime.sendMessage(chrome.runtime.id,
      {
        method: "SAVE_MISSION",
        data: {
          uni: this.uni,
          mission: this.mission
        }
      }
    );
  }
}
