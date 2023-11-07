import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap,map, catchError, delay } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { enviroment } from '../../enviroments/environment';
import { ResponseToken } from '../interfaces/response-token.interface';
import { Observable , of} from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';
import { UsuarioPerfil } from '../interfaces/update-perfil.interface';
import { CargarUsuario, UsuariosCargados } from '../interfaces/usuario-mantenimiento.interface';
import Swal from 'sweetalert2';


declare const google: any;

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(private http: HttpClient,private router: Router) {
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.usuario.getUid()||'';
  }

  get headers(){
    return  {
      headers:{
      'x-token':this.token
    }
  }
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke(this.usuario.getEmail(),()=>{
    this.router.navigateByUrl('/login');
    });
  }

  validarToken():Observable<boolean>{

   // console.log('En el renew ',localStorage.getItem('token'));
    
   return this.http.get<UsuarioLogueado>(`${base_url}/login/renew`,this.headers).pipe(
        map((resp : UsuarioLogueado)=>{

          const { email, google, nombre, role, img='', uid} = resp.usuario;

          this.usuario = new Usuario(nombre,email,'',img,google,role,uid);

          localStorage.setItem('token',resp.token);

          return true;
        }),
        catchError(error =>of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post<ResponseToken>(`${base_url}/usuarios`, formData).pipe(
      tap((resp: ResponseToken) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }
 // actualizarPerfil(data: {emai:string, nombre:string}){}otra forma de recibir data
  actualizarPerfil(perfil: UsuarioPerfil){

    perfil = {
      ...perfil,
      role: this.usuario.getRole(),
    }
    return this.http.put<ResponseToken>(`${base_url}/usuarios/${this.uid}`, perfil,this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post<ResponseToken>(`${base_url}/login`, formData).pipe(
      tap((resp: ResponseToken) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http
      .post<ResponseToken>(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: ResponseToken) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  cargarUsuarios(desde:number = 0){
     
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<UsuariosCargados>(url,this.headers)
            .pipe(
              delay(1000),
              map(resp=> {
                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));

                  //console.log(usuarios[0].getRole());

                return {
                  total: resp.total,
                  usuarios,
                };
              })
      );
  }
  eliminarUsuario(usuario:Usuario){
    const url = `${base_url}/usuarios/${usuario.getUid()}`;
    return this.http.delete(url,this.headers);
  }

  guardarUsuario(usuario: Usuario){
    return this.http.put<ResponseToken>(`${base_url}/usuarios/${usuario.getUid()}`, usuario,this.headers);
  }
}
