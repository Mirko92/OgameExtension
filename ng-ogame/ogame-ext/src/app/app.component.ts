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

  private executeScript(script: string){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: script });
    });
  }

  runBot(){
    this.executeScript(`bot(${this.maxBet});`);
  }

  stop(){
    this.executeScript(`stop();`);
  }

  bet(){
    this.executeScript('betMetal();');
  }
}
