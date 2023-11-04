import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsuarioService);
  const router = inject(Router);

  console.log('Paso por el canActivate');

  // return userService.validarToken().subscribe(
  //   {next: (resp: any) =>{
  //       console.log(resp);
  //   },
  //   error: (err)=>{
  //     console.log(err);
  //   }}
  // )

  console.log(userService.validarToken());
  return userService.validarToken().pipe(
    tap((isAuth) => {
      if (!isAuth) {
        router.navigateByUrl('/login');
      }
    })
  );
};
