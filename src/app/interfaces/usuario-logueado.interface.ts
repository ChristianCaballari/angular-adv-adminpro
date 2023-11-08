export interface UsuarioLogueado {
     ok:boolean,
     token:string,
     menu:any,
     usuario:{
     nombre:string,
     email:string,
     img?: string,
     google?: boolean,
     role?: string,
     uid?: string,
   }
}