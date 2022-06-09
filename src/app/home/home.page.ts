import { CuestionarioService } from './../servicios/cuestionario.service';
import { IPregunta } from './../interfaces/interfaces';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public cuestionario: CuestionarioService) {
  }

  public onClick(item: IPregunta) {
    this.cuestionario.responder(item);
  }

  public guardar() {
    this.cuestionario.guardar();
  }
}
