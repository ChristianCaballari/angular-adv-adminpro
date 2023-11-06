export interface UsuarioLogueado {
     ok:boolean,
     token:string,
     usuario:{
     nombre:string,
     email:string,
     img?: string,
     google?: boolean,
     role?: string,
     uid?: string,
   }
}