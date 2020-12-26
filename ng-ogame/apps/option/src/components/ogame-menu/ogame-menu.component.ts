import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { OgamePlanet } from 'model/OgameStorage';
import { nextTick } from 'process';

@Component({
  selector: 'og-menu',
  templateUrl: './ogame-menu.component.html',
  styleUrls: ['./ogame-menu.component.less']
})
export class OgameMenuComponent implements OnInit, OnChanges{

  @Input() storage: any;

  observer: IntersectionObserver;

  /**
   * Utility: return keys array of an object 
   */
  keysOf(arg) {
    return Object.keys(arg);
  }

  idForPlanet(p: OgamePlanet, uni: string) {
    return `${uni}_${p.galaxy}_${p.system}_${p.position}_${p.type}`;
  }

  get targets(){
    const r: any = this.keysOf(this.storage)
    .map(uni => (this.storage[uni].planets.map(x => `#${this.idForPlanet(x, uni)}`)) );
    return r.flat();
  }

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          console.debug("Entry:", entry);
          console.debug("IsIntersecting:", entry.isIntersecting);
          // Each entry describes an intersection change for one observed
          // target element:
          //   entry.boundingClientRect
          //   entry.intersectionRatio
          //   entry.intersectionRect
          //   entry.isIntersecting
          //   entry.rootBounds
          //   entry.target
          //   entry.time
        });
      },
      {
        root: null,//document.querySelector('html'),
        rootMargin: '0px',
        threshold: 0.5
      }
    );

  }

  ngOnChanges(){
    // nextTick(() => {
    //   this.targets.forEach(selector => {
    //     console.debug("selector", selector);
    //     const el = document.querySelector(selector);
    //     console.debug("el", el);
    //     el && this.observer.observe(el);
    //   })
    // });
  }
}
