import { BusquedasService } from './../../../services/busquedas.service';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from './../../../services/hospital.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;


  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService:BusquedasService
    ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
      
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id || '', hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  elimiminarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Borrar Hospital?',
      text: `Estas apunto de borra el ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService
          .eliminarHospital(hospital._id || '')
          .subscribe((resp) => {
            Swal.fire({
              title: 'hospital borrado!',
              text: `${hospital.nombre} fue eliminado correctamente`,
              icon: 'success',
            });
            this.cargarHospitales();
          });
      }
    });
  }

  async abrirModalSweetAlert(){
       const {value =''} = await Swal.fire<string>({
        text:'Ingrese el nombre del nuevo hospital',
        title:'Crear hospital',
        input:'text',
        showCancelButton:true,
        inputPlaceholder:'Nombre del hospital'
       })
        if((value!.trim().length) > 0){
          this.hospitalService.crearHospital(value!)
          .subscribe((resp:any)=>{
            Swal.fire({
              title: 'hospital creado!',
              text: `${value} fue eliminado correctamente`,
              icon: 'success',
            });
           // this.hospitales.push(resp.hospital);
           this.cargarHospitales();
          });
        }
      }
      abrirModal(hospital:Hospital){
        console.log(hospital.img);
        this.modalImagenService.abrirModal('hospitales',hospital._id!,hospital.img!);
      }


      buscar(termino:string){
        if(termino.length === 0){ return this.cargarHospitales()}

        this.busquedasService.buscar('hospitales',termino)
            .subscribe((resultados) =>{
              this.hospitales = resultados as Hospital[];
            });
            return;
      }
}
