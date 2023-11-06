import { UsuarioService } from './../../services/usuario.service';
import { SidebarService } from './../../services/sidebar.service';
import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

 public menuItems: any[];

 public usuario: Usuario;

  constructor(private sidebarService: SidebarService,
    private usuarioService:UsuarioService){
       
       this.menuItems = sidebarService.menu;
       this.usuario = usuarioService.usuario;
  }
  logout(){
    this.usuarioService.logout();
  }

}
