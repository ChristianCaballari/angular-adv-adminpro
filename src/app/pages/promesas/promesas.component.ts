import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  ngOnInit(): void {
    //     const promesa = new Promise((resolve, reject) =>{
    //       if(false){
    //       resolve('Hola Mundo');
    //       }else{
    //         reject('Algo salio mal');
    //       }
    //     });
    //     promesa.then((mensaje)=>{
    //       console.log(mensaje);//Obtengo el valor del resolve
    //     }).catch(error => console.log('Error en mi promesa', error));//el valor del reject
    //     console.log('Fin del Init');

    // this.getUsuarios();
    this.getUsuarios().then((usuarios) => {
      console.log(usuarios);
    });
  }

  //Funciones que retornan promesas
  getUsuarios() {
    const promesa = new Promise((resolve) => {
      fetch(`https://reqres.in/api/users`)
        .then((resp) => resp.json())
        .then((body) => resolve(body.data));
    });
    return promesa;
  }
}
