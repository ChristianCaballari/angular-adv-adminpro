import { BusquedasService } from './../../../services/busquedas.service';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from './../../../services/medico.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, delay } from 'rxjs';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit,OnDestroy {

  public medicos: Medico[] = [];
  public imgSubs!: Subscription;
  public cargando: boolean = true

  constructor(
    private medicoService:MedicoService,
    private router: Router,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
    ){

  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this .modalImagenService.nuevaImagen.pipe(delay(100))
    .subscribe(img => this.cargarMedicos()); 
  }

  cargarMedicos(){
    this.cargando = true;
     this.medicoService.cargarMedicos()
         .subscribe(
          resp=>{
            this.cargando = false;
            this.medicos = resp;
          }
    )
  }

  editarMedico(medico:Medico){
    this.router.navigateByUrl(`dashboard/medicos/${medico._id}`);
  }

  eliminarMedico(medico:Medico){
    Swal.fire({
      title: 'Borrar Medico?',
      text: `Estas apunto de borra el ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService
          .eliminarMedico(medico._id!)
          .subscribe((resp) => {
            Swal.fire({
              title: 'Médico borrado!',
              text: `${medico.nombre} fue eliminado correctamente`,
              icon: 'success',
            });
            this.cargarMedicos();
          });
      }
    });
  }

  buscar(termino: string){
    if(termino.length === 0)return this.cargarMedicos();

    this.busquedasService.buscar('medicos',termino)
    .subscribe((resultados)=>{
        this.medicos = resultados as Medico[];
    });
  }
  abrirModal(medico:Medico){

    this.modalImagenService.abrirModal('medicos',medico._id!,medico.img);

  }
}
