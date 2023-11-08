import { BusquedasService } from './../../services/busquedas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from 'src/app/models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] =[];
  public medicos: Medico[] =[];
  public hospitales: Hospital[] =[];


  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private router: Router
    ){}

  ngOnInit(): void {
     this.activatedRoute.params
     .subscribe(({termino}) =>{
     this.busquedaGlobal(termino);
     });
  }

  busquedaGlobal(termino:string){
    this.busquedasService.busquedaGlobal(termino)
         .subscribe((resp:any)=>{
          console.log(resp);
          this.hospitales = resp.hospitales;
          this.medicos = resp.medicos;

          if(resp.usuarios){
              this.usuarios  = resp.usuarios.map(
                (user:any) => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));   
              }
      })   
  }
  abrirMedico(medico:Medico){
    this.router.navigateByUrl(`/dashboard/medicos/${medico._id}`);
  }

}
