import { Usuario } from "../models/usuario.model";

export interface CargarUsuario {
     total: number;
     usuarios: Usuario[];
 }

export interface UsuariosCargados{
      total: number;
      usuarios: Usuarios[];
}
export interface Usuarios{
     nombre:string;
     email:string;
     google:boolean;
     role:string;
     img:string;
     uid:string;
   
}

