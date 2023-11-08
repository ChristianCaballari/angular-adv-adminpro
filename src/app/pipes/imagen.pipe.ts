import { Pipe, PipeTransform } from '@angular/core';
import { enviroment } from 'src/enviroments/environment';


const base_url = enviroment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {
  
    console.log({pipe:img});
    let imgUrl = '';
    if(!img){
      imgUrl= `${base_url}/upload/${tipo}/no-image`;
    }else if(img.includes('https')){
       imgUrl = img;
    }else if(img){
      imgUrl= `${base_url}/upload/${tipo}/${img}`;
    }else{
      imgUrl= `${base_url}/upload/${tipo}/no-image`;
    }


    // if ( img.includes('https') ) {
    //   imgUrl = img;
    // } else {
    //   if(tipo ==='usuarios'){
    //    // imgUrl = `${ base_url }/upload/${ tipo }/${ this.recconstruirImagenUsuario(img) }`;
    //   }else{
    //     imgUrl= `${ base_url }/upload/${ tipo }/${ img }`;
    //   }    
    // } 



    return imgUrl;
  }
}
