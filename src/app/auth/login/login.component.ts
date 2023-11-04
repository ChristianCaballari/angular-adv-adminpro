import { ResponseToken } from './../../interfaces/response-token.interface';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
//AfterViewInit = nos permite mutar un paso en el ciclo de vida cuando ya este el componente inicializado.
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: [
   
  ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm : FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || 'test100@gmail.com' , [ Validators.required, Validators.email ] ],
    password: ['123456', Validators.required ],
    remember: [false]
  });

  constructor( private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
     ) { }

      ngAfterViewInit(): void {
          this.googleInit();
      }

      googleInit(){
        google.accounts.id.initialize({
          client_id: "266019654383-br7visucea48qhcp0r0mrt0brdpqomhr.apps.googleusercontent.com",
          callback: (response:any) => this.handleCredentialResponse(response)
        });
        google.accounts.id.renderButton(
          // document.getElementById("buttonDiv"),
          this.googleBtn.nativeElement,
          { theme: "outline", size: "large" }  // customization attributes
        );
      }
      handleCredentialResponse(response: any){
        this.usuarioService.loginGoogle(response.credential)
            .subscribe(
              {next: (resp: ResponseToken) =>{
                //Redireccionar al dashboard
                this.router.navigateByUrl('/');
              },
              error: (err)=>{
                Swal.fire('Error',err.error.msg,'error');
              }
            });
      }
  login(){
    //Realizar el posteo
    this.usuarioService.login(this.loginForm.value)
    .subscribe(
      {next: (resp:ResponseToken)=>{
        if(this.loginForm.get('remember')?.value){
          localStorage.setItem('email', this.loginForm.get('email')?.value );   
        }else{
          localStorage.removeItem('email');
        }
        //Redireccionar al dashboard
        this.router.navigateByUrl('/');
      },
      error: (err)=> 
          {
           //Si sucede unerror
           Swal.fire('Error',err.error.msg,'error');
          },
       });
    }  
}

