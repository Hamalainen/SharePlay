import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SocketStatusComponent } from './main/socket-status/socket-status.component';
import { BeerRatingComponent } from './main/beer-rating/beer-rating.component'

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'beer', component: BeerRatingComponent },
  { path: 'server', component: SocketStatusComponent },
  { path: ':room', component: MainComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
