import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.less']
})
export class FleetComponent {

  @Input()
  ships: any[];

  @Input()
  editable: boolean = false;

  @Output()
  onChange: EventEmitter<{id:number, value: number}> = new EventEmitter();

  /**
   * Passa value and icon of a single ship
   */
  getShipById(id: number) {
    return this.ships?.find(s => s.id === id) || { id };
  }

  emitChange(value: {id:number, value: number}){
    this.onChange.emit(value);
  }
}
