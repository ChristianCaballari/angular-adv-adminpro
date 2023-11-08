import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { enviroment } from '../../enviroments/environment';
import { ResponseToken } from '../interfaces/response-token.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';
import { UsuarioPerfil } from '../interfaces/update-perfil.interface';
import { UsuariosCargados } from '../interfaces/usuario-mantenimiento.interface';

declare const google: any;

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role():string {
     return this.usuario.getRole().toString();
  }
  
  get uid(): string {
    return this.usuario.getUid() || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
  logout() {
    localStorage.removeItem('token');
    // TODO: Borrar menu
    localStorage.removeItem('menu');

    //this.router.navigateByUrl('/login');
    console.log(this.usuario.getGoogle());
    if (this.usuario.getGoogle()) {
      google.accounts.id.revoke(this.usuario.getEmail(), () => {
        this.router.navigateByUrl('/login');
      });
    }else{
      this.router.navigateByUrl('/login');

    }
  }

  validarToken(): Observable<boolean> {
    // console.log('En el renew ',localStorage.getItem('token'));

    return this.http
      .get<UsuarioLogueado>(`${base_url}/login/renew`, this.headers)
      .pipe(
        map((resp: UsuarioLogueado) => {
          const { email, google, nombre, role, img = '', uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

          this.guardarLocalStorage(resp.token, resp.menu);

          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post<ResponseToken>(`${base_url}/usuarios`, formData).pipe(
      tap((resp: ResponseToken) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }
  // actualizarPerfil(data: {emai:string, nombre:string}){}otra forma de recibir data
  actualizarPerfil(perfil: UsuarioPerfil) {
    perfil = {
      ...perfil,
      role: this.usuario.getRole(),
    };
    return this.http.put<ResponseToken>(
      `${base_url}/usuarios/${this.uid}`,
      perfil,
      this.headers
    );
  }

  login(formData: LoginForm) {
    return this.http.post<ResponseToken>(`${base_url}/login`, formData).pipe(
      tap((resp: ResponseToken) => {
        console.log(resp);
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http
      .post<ResponseToken>(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: ResponseToken) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<UsuariosCargados>(url, this.headers).pipe(
      delay(1000),
      map((resp) => {
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );

        //console.log(usuarios[0].getRole());

        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }
  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.getUid()}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put<ResponseToken>(
      `${base_url}/usuarios/${usuario.getUid()}`,
      usuario,
      this.headers
    );
  }
}
