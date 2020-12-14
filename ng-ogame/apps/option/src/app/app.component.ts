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

  storage: any = {};

  keysOf(arg) {
    return Object.keys(arg);
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initStorage();

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (var key in changes) {
        var storageChange = changes[key];

        console.debug(
          'Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
          key,
          namespace);

        console.debug("Old value was ", storageChange.oldValue);
        console.debug("New value is  ", storageChange.newValue);
      }
    });
  }

  initStorage() {
    // TODO: Alternale le due tramite l'environment ? 
    if (chrome.storage) {
      // Chiamata reale fattile solo in context dell'estensione
      const promise = new Promise((resolve) => {
        chrome.storage?.local.get(null, resolve);
      });

      promise.then(r => {
        console.debug("r", r);
        this.storage = r;
      });
    } else {
      // Mockup
      console.warn("USING MOCKUP");
      this.http.get<any>('/assets/data.json').subscribe(r => this.storage = r);
    }

  }
}
