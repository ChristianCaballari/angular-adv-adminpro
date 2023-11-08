import { ModalImagenService } from './../../../services/modal-imagen.service';
import { BusquedasService } from './../../../services/busquedas.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit ,OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[]=[];
  public usuariosTemp: Usuario[]=[];

  public imgSubs!: Subscription;
  public desde:number = 0;
  public cargando: boolean = true;

  constructor(
    private usuarioService:UsuarioService,
    private busquedasService:BusquedasService,
    private modalImagenService: ModalImagenService
    ){
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

ngOnInit():void{
   this.cargarUsuarios();
 this.imgSubs =  this.modalImagenService.nuevaImagen.subscribe(img =>this.cargarUsuarios());
}

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({total,usuarios})=>{
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.totalUsuarios = total;
      this.cargando = false;
    });
  }
  cambiarPagina(valor: number){
    
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    }else if(this.desde >= this.totalUsuarios){
      this.desde -=valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string){
    
     if(termino.length === 0){return this.usuariosTemp = this.usuarios; }

    this.busquedasService.buscar('usuarios',termino)
      .subscribe((resultados )=>{
          this.usuarios = resultados as Usuario[];
      });
      return;
  }
  public eliminarUsuario(usuario: Usuario){
    if(usuario.getUid() === this.usuarioService.uid){
      return (Swal.fire('Error','No puede borrar asimismo','error'));
    }


    Swal.fire({
      title: "Borrar Usuario?",
      text: `Estas apunto de borra a ${usuario.getNombre()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, borrlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(
         resp=>{
          Swal.fire({
            title: "Usuario borrado!",
            text: `${usuario.getNombre()} fue eliminado correctamente`,
            icon: "success"
          });
          this.cargarUsuarios();
         }
        );    
      }
    });
    return ;
  }
  cambiarRole(usuario:Usuario){
     this.usuarioService.guardarUsuario(usuario)
        .subscribe(resp => {
        });
    }
    abrirModal(usuario:Usuario){

      this.modalImagenService.abrirModal('usuarios',usuario.getUid()||'',usuario.getImg());
    }
}

