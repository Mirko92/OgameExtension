import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.less']
})
export class ShipComponent implements OnInit {

  @Input()
  ship: any; 

  constructor() { }

  ngOnInit(): void {
    console.debug("asd", this.ship);
  }

  get shipName(){
    return this.mapping[this.ship?.id];
  }

  get shipAmount(){
    return this.ship?.number || "0";
  }

  get shipIconClass(){
    return `${this.mapping[this.ship?.id]?.iconClass} ${this.shipAmount > 0 ? '' : 'disabled'}`;
  }

  mapping = {
    202:{name:"Cargo leggero",              iconClass:"transporterSmall"  },
    203:{name:"Cargo Pesante",              iconClass:"transporterLarge"  },
    204:{name:"Caccia Leggero",             iconClass:"fighterLight"      },
    205:{name:"Caccia Pesante",             iconClass:"fighterHeavy"      },
    206:{name:"Incrociatore",               iconClass:"cruiser"           },
    207:{name:"Nave da battaglia",          iconClass:"battleship"        },
    208:{name:"Colonizzatrice",             iconClass:"colonyShip"        },
    209:{name:"Riciclatrici",               iconClass:"recycler"          },
    210:{name:"Sonda spia",                 iconClass:"espionageProbe"    },
    211:{name:"Bombardiere",                iconClass:"bomber"            },
    213:{name:"Corazzata",                  iconClass:"destroyer"         },
    214:{name:"Morte Nera",                 iconClass:"deathstar"         },
    215:{name:"Incrociatore da Battaglia",  iconClass:"interceptor"       },
    218:{name:"Reaper",                     iconClass:"reaper"            },
    219:{name:"Pathfinder",                 iconClass:"explorer"          }
  };
}
