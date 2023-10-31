import { Component, OnDestroy } from '@angular/core';
import { Observable,Subscription,interval } from 'rxjs';
import { retry,take,map,filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  // public intervalSubs: Subscription;

  constructor(){

    
  //   this.retornaObservable().pipe(
  //     retry()
  //   ).subscribe(
  //     valor => console.log('Subs: ',valor),
  //     error => console.warn('Error: ',error),
  //     ()=> console.info('Observable terminado')
  //   );
  // this.intervalSubs = this.retornaIntervalo()
  //  .subscribe(valor => console.log)
  }
  ngOnDestroy(): void {
    // this.intervalSubs.unsubscribe();
  }

  retornaIntervalo():Observable<number>{
    return interval(1000)
                      .pipe(
                       map(valor => valor + 1),
                       filter(valor => (valor % 2 == 0) ? true: false),
                       take(10),
                       );
      //filter me sirve para mostrar un valor o no de manera condicional
      //map, muta los valores, dependiendo de lo que quiera que yo haga.
  }
  retornaObservable():Observable<number>{
    let i = -1;

    const obs$ = new Observable<number>( observer =>{
      
     const intervarlo = setInterval( () =>{
          i++;
          observer.next(i);
          if(i === 4){
              clearInterval(intervarlo);
              observer.complete();
          }
          if( i === 2){
            observer.error('Hubo un error en el obsevable, i llego al valor de 2');
          }
      },1000);
    });
    return obs$;
  }
}
