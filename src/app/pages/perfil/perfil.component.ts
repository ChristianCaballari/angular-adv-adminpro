import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { FileUploadService } from './../../services/file-upload.service';
import { UsuarioService } from './../../services/usuario.service';
import { ResponseToken } from 'src/app/interfaces/response-token.interface';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp : any = '';
   

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService){
    this.perfilForm = this.fb.group({});
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.getNombre(),Validators.required],
      email: [this.usuario.getEmail(),[Validators.required,Validators.email]]
    });
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
    .subscribe(
      {next: (resp:ResponseToken) =>{
        const {nombre, email} = this.perfilForm.value;
        this.usuario.setNombre(nombre);
        this.usuario.setEmail(email);
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      },
      error: (err)=>{
        Swal.fire('Error',err.error.msg,'error');
      }
    });;
  }
  cambiarImagen( file: File ) {
    
    this.imagenSubir = file;

    if ( !file ) { return }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
   
  }
   subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir,'usuarios', this.usuario.getUid()||'')
    .then(img => {
      this.usuario.setImg(img);
      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
    }, (err)=>{
      Swal.fire('Error', err.msg, 'error');
    })
   }
}
