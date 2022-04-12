import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';

// Hacer esto con AppRoutingModulo o con RouterModule e importarlo en los import es lo mismo
// Es para hacer uso del router-outlet
// import { AppRoutingModule } from './../app-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent
  ],
  exports:[  
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent],
  imports: [
    CommonModule,
    SharedModule,
    // AppRoutingModule,
    RouterModule
  ]
})
export class PagesModule { }
