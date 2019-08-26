import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component'
import { SocketStatusComponent } from './main/socket-status/socket-status.component'

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: ':room', component: MainComponent },
  { path: ':room/server', component: SocketStatusComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
