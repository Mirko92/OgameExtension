import { Component } from '@angular/core';

declare const chrome;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ogame-ext';

  maxBet: number = 5000;

  runBot(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: `bot(${this.maxBet.value})` });
    });
  }

  stop(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: 'stop();' });
    });
  }
}
