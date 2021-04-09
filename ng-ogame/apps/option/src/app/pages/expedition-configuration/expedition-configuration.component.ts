import { Component } from '@angular/core';
import { StorageService } from 'apps/option/src/services/storage.service';

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

}
