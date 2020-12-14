import { HttpClient } from '@angular/common/http';
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

  keysOf(arg) {
    return Object.keys(arg);
  }

  testo = "TESTO";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initStorage();
  }

  initStorage() {
    // TODO: Alternale le due tramite l'environment ? 
    if (chrome.storage) {
      // Chiamata reale fattile solo in context dell'estensione
      const promise = new Promise((resolve) => {
        chrome.storage?.local.get(null, resolve);
      });

      promise.then(r => {
        this.storage = r;
      });
    } else {
      // Mockup
      console.warn("USING MOCKUP");
      this.http.get<any>('/assets/data.json').subscribe(r => this.storage = r);
    }

  }
}
