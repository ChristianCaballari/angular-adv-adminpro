import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  //@ViewChild('botonCerrarSidebar') botonCerrarSidebar: ElementRef;

  constructor(private router: Router,) { }

  ngOnInit(): void {

  }

  
  cerrarSidebar(){

 //   this.botonCerrarSidebar.nativeElement.click();
   }

}
