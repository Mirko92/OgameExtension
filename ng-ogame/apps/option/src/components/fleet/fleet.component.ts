import { Component, Input } from '@angular/core';
import { OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.less']
})
export class FleetComponent {

  @Input()
  planet: OgamePlanet;

  /**
   * Passa value and icon of a single ship
   */
  getShipById(shipsData: any, id: number) {
    return shipsData?.find(s => s.id === id) || { id };
  }
}
