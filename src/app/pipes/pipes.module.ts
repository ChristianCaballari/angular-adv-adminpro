import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';


//No ocupo el CommonModule porque no voy a nececitar hacer el ngIf, ngFor...

@NgModule({
  declarations: [ImagenPipe],
  exports: [ImagenPipe]
})
export class PipesModule { }
