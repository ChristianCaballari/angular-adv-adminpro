import { EventEmitter, Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/environment';
const base_url = enviroment.base_url;
@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo!: 'usuarios'|'medicos'|'hospitales';
  public id!: string;
  public img!: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal( 
      tipo: 'usuarios'|'medicos'|'hospitales',
      id: string,
      img: string='no-image',
    ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // localhost:3000/api/upload/medicos/no-img
    // if ( img.includes('https') ) {
    //  return this.img = img;
    // }else if(!img){
    //    this.img = `${base_url}/upload/${tipo}/no-image`;
    // }else if(!img.includes('https')&& img){
    //   console.log('Concatenadode modelo user');
    //   this.img =  `${ base_url }/upload/${ tipo }/${ img }`;
    // } 
    // return 
    if ( img.includes('https') ) {
      this.img = img;
    } else {
      if(tipo ==='usuarios'){
       this.img = `${ base_url }/upload/${ tipo }/${ this.recconstruirImagenUsuario(img) }`;
      }else{
        this.img = `${ base_url }/upload/${ tipo }/${ img }`;
      }    
    }    
  }
  recconstruirImagenUsuario(img:string){
    let arrayTemp = img.split('/');
    img = '';
    return arrayTemp[arrayTemp.length-1];
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
