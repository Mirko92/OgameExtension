import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
  // TODO: Potrebbe essere un idea far terminare il path con index.html in modo da riabilitare il refresh 
  // {
  //   path: '*',
  //   pathMatch: 'full',
  //   redirectTo: '/index.html'
  // },

  // {
  //   path: '/index.html',
  //   pathMatch: 'full',
  //   component: AppComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
