import { UsuarioService } from './../../services/usuario.service';
import { SidebarService } from './../../services/sidebar.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  menuItems: any[];


  constructor(private sidebarService: SidebarService,
    private usuarioService:UsuarioService){
       this.menuItems = sidebarService.menu;
  }
  logout(){
    this.usuarioService.logout();
  }
}
