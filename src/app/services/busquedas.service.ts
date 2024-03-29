import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/environment';
import { CargarUsuario } from '../interfaces/usuario-mantenimiento.interface';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = enviroment.base_url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  private get token():string{
    return localStorage.getItem('token') || '';
  }

  private get headers(){
    return  {
      headers:{
      'x-token':this.token
     }
    }
  }
  private transformarUsuarios(resultados:any[]):Usuario[]{

     return  resultados.map(
      user => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));   
  }
  private transformarHospitales(resultados:any[]):Hospital[]{
       return resultados;
  }

  private transformarMedicos(resultados:any[]):Medico[]{
    return resultados;
}

  busquedaGlobal(termino:string) {
      const url  = `${base_url}/todo/${termino}`;
      return this.http.get(url, this.headers);
  }

  buscar(
    tipo:'usuarios'|'medicos'|'hospitales',
    termino:string = ''){
      //http://localhost:3005/api/todo/coleccion/hospitales/a

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;

    return this.http.get<Hospital[]|Usuario[]>(url,this.headers)
            .pipe(
                 map( (resp:any)=>{
                  switch(tipo){
                    case 'usuarios':
                         return this.transformarUsuarios(resp.resultados);
                    case 'medicos':
                          return this.transformarMedicos(resp.resultados);
                    case 'hospitales':
                          return this.transformarHospitales(resp.resultados);
                      default:
                        return [];
                    }
                 })
            );
      }
}
