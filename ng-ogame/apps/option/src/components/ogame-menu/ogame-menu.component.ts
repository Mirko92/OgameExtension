import { Component, Input } from '@angular/core';
import { OgamePlanet } from 'model/OgameStorage';

@Component({
  selector: 'og-menu',
  templateUrl: './ogame-menu.component.html',
  styleUrls: ['./ogame-menu.component.less']
})
export class OgameMenuComponent {

  @Input() storage: any;

  /**
   * Utility: return keys array of an object 
   */
  keysOf(arg) {
    return Object.keys(arg);
  }

  /**
   * TODO: Controllare se è utile 
   * Scrolla in maniera fluida fino all'elemento desiderato 
   */
  goTo(uni:string, p: OgamePlanet){
    document.querySelector(`#${uni}_${p.galaxy}_${p.system}_${p.position}_${p.type}`).scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}
