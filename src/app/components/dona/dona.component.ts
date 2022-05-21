
import { Component, Input } from '@angular/core';
import { ChartData,Color} from 'chart.js';



@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string  = 'Sin titulo';
  
  @Input('labels') doughnutChartLabels: string[] = ['Label1', 'Label2', 'Label2'];
  @Input('data1') doughnutChartData: Object = [
    [350, 450, 100],
  ];

  public colors: any[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];
}
