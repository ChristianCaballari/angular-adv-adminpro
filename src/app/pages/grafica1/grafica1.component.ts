import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1 :string[] = ['Pan','Refresco','Leche',];

  public data1: ChartData<'doughnut'> = {
    labels: this.labels1,
    datasets: [
      { data: [10,15,40] },
    ],
  };
}
