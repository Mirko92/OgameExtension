import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'og-speed',
  templateUrl: './ogame-speed.component.html',
  styleUrls: ['./ogame-speed.component.less']
})
export class OgameSpeedComponent {
  @Input("speed")
  _speed: any;

  @Output()
  speedChange = new EventEmitter<any>();

  get speed() {
    return this._speed;
  }

  set speed(value: number) {
    this.speedChange.emit(value);
  }

  speedOptions: number[] = [
    10,20,30,40,50,60,70,80,90,100
  ]
}
