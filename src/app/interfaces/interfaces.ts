// Se usa un entero para controlar el estado de la pregunta: 
// 0- No contestada
// 1-Respuesta correcta
// <0: Respuesta incorrecta (número de fallos)
export interface IPregunta {
  pregunta: string;
  respuesta: string;
  contestada: number;       
}
