import { Component, OnInit } from '@angular/core';
declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'option';

  storage: any = { "PROVA": "ASD" };

  keysOf(arg){
    return Object.keys(arg);
  }

  testo = "TESTO";

  ngOnInit(): void {
    this.initStorage();
  }

  initStorage() {
    console.debug("ci provos");

    const promise = new Promise((resolve) => {
      chrome.storage.local.get(null, resolve);
    });

    promise.then(r => {
      this.storage = r;
    });

  }
}
