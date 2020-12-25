import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'og-missions',
  templateUrl: './ogame-missions.component.html',
  styleUrls: ['./ogame-missions.component.less']
})
export class OgameMissionsComponent {

  @Input("mission")
  _mission: any;

  @Output()
  missionChange = new EventEmitter<any>();

  get mission() {
    return this._mission;
  }

  set mission(value: number) {
    this.missionChange.emit(value);
  }

}
