import { Component } from '@angular/core';
import { StorageService } from 'apps/option/src/services/storage.service';
import { OgameData } from 'model/OgameStorage';

@Component({
  selector: 'og-expedition-configuration',
  templateUrl: './expedition-configuration.component.html',
  styleUrls: ['./expedition-configuration.component.less']
})
export class ExpeditionConfigurationComponent {
  constructor(
    private storageSVC: StorageService
  ) { }

  get storage() {
    return this.storageSVC.storage;
  };

  get ogameData() {
    return this.storage?.ogameData;
  }

  onChange(uniData: OgameData, value: {id: number, value: number}){
    let { code: uni } = uniData;

    const expeditionConfig = { 
      ...(uniData.expeditionConfig || {}), 
      ...value
    };

    chrome.runtime.sendMessage(chrome.runtime.id,
      {
        method: "SAVE_EXPEDITION_CONFIG",
        data: {
          uni,
          expeditionConfig
        }
      }
    );
  }
}
