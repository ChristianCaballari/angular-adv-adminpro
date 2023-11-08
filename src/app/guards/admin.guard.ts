import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';

export const AdminGuard: CanActivateFn = (route, state) => {

  const userService = inject(UsuarioService);
  const router = inject(Router);

    // if(userService.role === 'ADMIN_ROLE'){
    //   return true;
    // }else{
    //  router.navigateByUrl('dashboard');
    //  return false;
    // }

    //hace lo mismo.
  return (userService.role === 'ADMIN_ROLE') ? true : router.navigateByUrl('dashboard');

};
