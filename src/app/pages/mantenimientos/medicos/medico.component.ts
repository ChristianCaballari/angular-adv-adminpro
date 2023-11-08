import { delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from './../../../services/medico.service';
import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital | undefined;
  public medicoSeleccionado: Medico | undefined;

  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (hosp) => hosp._id === hospitalId
      );
    });
  }

  private cargarMedico(id: string) {
    console.log(id);
    if (id === 'nuevo') return;

    this.medicoService.getMedicoById(id)
    .pipe(delay(100))
    .subscribe({
      next:(resp:any)=>{
        console.log(resp);
        console.log('No deberia entrar');
        const { nombre, hospital: { _id }} = resp.medico;
      
        this.medicoForm.setValue({ nombre, hospital: _id });
        this.medicoSeleccionado = resp.medico as Medico;
      },
      error:() =>{
        this.router.navigateByUrl(`/dashboard/medicos`);

      }
    })
     
  }
 
  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }
  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //vamos actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      //crear medico
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');

          //http://localhost:4200/dashboard/medicos/65427a6fd2767441e30dcaeb
          this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`);
        });
    }
  }
}
