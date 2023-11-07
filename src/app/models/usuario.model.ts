import { enviroment } from '../../enviroments/environment';

const base_url = enviroment.base_url;

export class Usuario {
     
     private nombre: string;
     private email: string;
     private password?:string;
     private img?: string;
     private google?: boolean;
     public role!: string;
     private uid?: string;
   
     constructor(
          nombre:string,
          email:string,
          password?:string,
          img?: string,
          google?: boolean,
          role?: string,
          uid?: string,
          ){
               this.nombre = nombre;
               this.email = email;
               this.password = password;
               this.img = img;
               this.google = google;
               this.role = role||'';
               this.uid = uid;
               
     }
     //setter And getter
     public setNombre(nombre:string){
          this.nombre = nombre;
     }
     public getNombre():string{
          return this.nombre||'';
     }
     public setEmail(email:string){
          this.email = email;
     }
     public getEmail():string{
          return this.email||'';
     }
     public setPassword(password:string){
          this.password = password;
     }
     public getPassword(){
         return this.password;
     }
     public setImg(img:string){
          this.img = img;
     }
     public getImg(){
          let imgUrl = '';
          if(this.img?.includes('https')){

              return imgUrl = this.img;
          }
          if(this.img){
             imgUrl= `${base_url}/upload/usuarios/${this.img}`;
          }else{

               imgUrl= `${base_url}/upload/usuarios/no-image`;
          }
          return imgUrl;
     }
     public setGoogle(google:boolean){
           this.google = google;
     }
     public getGoogle(){
          return this.google;
     }
     public setRole(role:string){
          this.role = role;
     }
     public getRole():string{
         return this.role;
     }
     public setUid(uid:string){
          this.uid = uid;
     }
     public getUid(){
          return this.uid;
     }
}