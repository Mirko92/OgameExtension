import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { FleetConfigurationComponent } from './pages/fleet-configuration/fleet-configuration.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/fleet-configuration'
  },

  {
    path: 'fleet-configuration',
    pathMatch: 'full',
    component: FleetConfigurationComponent
  },

  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', anchorScrolling: 'enabled', })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
