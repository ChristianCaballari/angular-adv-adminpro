import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap,map, catchError } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { enviroment } from '../../enviroments/environment';
import { ResponseToken } from '../interfaces/response-token.interface';
import { Observable , of} from 'rxjs';
import { Router } from '@angular/router';


declare const google: any;

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  constructor(private http: HttpClient,private router: Router) {}

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('christianccm17@gmail.com',()=>{
    this.router.navigateByUrl('/login');
    });
  }

  validarToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    
   return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token': token
      }
    }).pipe(
        tap((resp :any)=>{
          console.log(resp);
          localStorage.setItem('token',resp.token);
        }),
        map(resp =>resp.ok),
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
