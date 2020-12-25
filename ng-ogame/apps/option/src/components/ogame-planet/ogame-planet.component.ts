import { Component, Input, OnInit } from '@angular/core';
import { OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'og-planet',
  templateUrl: './ogame-planet.component.html',
  styleUrls: ['./ogame-planet.component.less']
})
export class OgamePlanetComponent implements OnInit {

  @Input()
  uni: string; 

  @Input()
  planet: OgamePlanet;

  constructor() { }

  ngOnInit(): void {
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
