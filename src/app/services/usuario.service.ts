import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap,map, catchError } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { enviroment } from '../../enviroments/environment';
import { ResponseToken } from '../interfaces/response-token.interface';
import { Observable , of} from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';
import { UsuarioPerfil } from '../interfaces/update-perfil.interface';


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

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke(this.usuario.getEmail(),()=>{
    this.router.navigateByUrl('/login');
    });
  }
  validarToken():Observable<boolean>{

   // console.log('En el renew ',localStorage.getItem('token'));
    
   return this.http.get<UsuarioLogueado>(`${base_url}/login/renew`,{
      headers:{
        'x-token': this.token
      }
    }).pipe(
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
       role: this.usuario.getRole()||''
    }

    return this.http.put<ResponseToken>(`${base_url}/usuarios/${this.uid}`, perfil,{
      headers: {
          'x-token':this.token
        }
    });
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
}
