import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IPregunta } from './../interfaces/interfaces';
import { Observable } from 'rxjs';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  // Recordad inicializar el array para evitar problemas
  public listaPreguntas:IPregunta[] = [];

  constructor(private consultasFichero: HttpClient, private alerta:AlertController, private storage: GestionStorageService) {
    this.cargarDatos();
  }

  // Método que devolverá todas las preguntas del cuestionario en un array
  public getPreguntas(): IPregunta[] {
    return this.listaPreguntas;
  }

  // Recupera las preguntas de Storage. Si no hay ninguna almacenada, las lee del fichero
  public cargarDatos() {
    let datosPromesa: Promise<IPregunta[]> = this.storage.getObject("cuestionario");

    datosPromesa.then( datos => {
      if (datos) {
        console.log(datos);
        this.listaPreguntas.push(...datos);
      } else {
        this.cargarFichero("datos.json");
      }

    });
  }

  // Lee los datos de un fichero y los almacena en un array
  private cargarFichero(nombreFichero: string) {
    let respuesta: Observable<IPregunta[]>
  
    respuesta = this.consultasFichero.get<IPregunta[]>("/assets/datos/" + nombreFichero);
    
    respuesta.subscribe( datos => {
      console.log("datos", datos);
      this.listaPreguntas = datos;
      // Inicializamos el estado de las preguntas que no se lee del fichero. Todas estarán sin contestar
      for (let item of this.listaPreguntas) {
        item.contestada = 0;
      }
    } ); 
  }

  // Abre una alerta con el enunciado de la pregunta y comprueba la respuesta
  // En función de si es correcta o no, actualiza su estado. En este caso, modificará el valor del atributo "contestada"
  public async responder(item: IPregunta) {
    const alert = await this.alerta.create({
      header: 'Pregunta',
      message: item.pregunta,
      inputs: [
        {
          name: 'respuesta',
          type: 'text',
          placeholder: 'Atención a la ortografía'
        }
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: (data) => {
            console.log(item.respuesta, data.respuesta);
            if (item.respuesta == data.respuesta) {
              console.log("Correcto");
              item.contestada = 1;
            } else if (item.contestada > 0) {
              console.log(item.contestada);
              item.contestada = -1;
            } else {
              console.log(item.contestada);
              item.contestada--;
            }
            console.log(item.contestada);
          }
        }
      ]
    });

    await alert.present();
  }

  // Almacena el array de preguntas en Storage
  public guardar() {
    this.storage.setObject("cuestionario", this.listaPreguntas);
  }
}
