import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { enviroment } from '../../enviroments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';
import { HospitalResponse } from '../interfaces/hospital.interface';

const base_url = enviroment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarHospitales() {
    const url = `${base_url}/hospitales`;
    return this.http
      .get<HospitalResponse>(url, this.headers)
      .pipe(map((resp) => resp.hospitales));
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  eliminarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
