import { Injectable } from '@angular/core';



export interface AutomataNFA {
  estados: string[];
  alfabeto: string[];
  estadoInicial: string;
  estadosFinales: string[];
  transiciones: {
    origen: string;
    simbolo: string;
    destino: string;
  }[];
}

export interface AutomataDFA {
  estados: string[];
  alfabeto: string[];
  estadoInicial: string;
  estadosFinales: string[];
  transiciones?: { origen: string, simbolo: string, destino: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AutomataService {
  convertirAutomataNFAaDFA(automataNFA: AutomataNFA): AutomataDFA {
    const automataDFA: AutomataDFA = {
      estados: [],
      alfabeto: automataNFA.alfabeto,
      estadoInicial: '',
      estadosFinales: [],
      transiciones: []
    };
  
    const estadosVisitados: { [key: string]: boolean } = {};
    const estadoInicial = automataNFA.estadoInicial;
    const cierreEpsilonInicial = this.cierreEpsilon(automataNFA, [estadoInicial]);
    const estadoInicialDFA = cierreEpsilonInicial.join(',');
    automataDFA.estados.push(estadoInicialDFA);
    automataDFA.estadoInicial = estadoInicialDFA;
  
    const pila: string[] = [estadoInicialDFA];
    estadosVisitados[estadoInicialDFA] = true;
  
    while (pila.length > 0) {
      const estadoActual = pila.pop();
  
      for (const simbolo of automataDFA.alfabeto) {
        const estadosSiguientes = this.cierreTransicion(automataNFA, estadoActual!.split(','), simbolo);
        const estadoSiguienteDFA = estadosSiguientes.join(',');
  
        if (!automataDFA.estados.includes(estadoSiguienteDFA)) {
          automataDFA.estados.push(estadoSiguienteDFA);
          pila.push(estadoSiguienteDFA);
          estadosVisitados[estadoSiguienteDFA] = true;
        }
  
        automataDFA.transiciones!.push({
          origen: estadoActual!,
          simbolo: simbolo,
          destino: estadoSiguienteDFA
        });
      }
    }
  
    for (const estado of automataDFA.estados) {
      const estados = estado.split(',');
      const esEstadoFinal = estados.some(est => automataNFA.estadosFinales.includes(est));
      if (esEstadoFinal) {
        automataDFA.estadosFinales.push(estado);
      }
    }
  
    automataDFA.transiciones = automataDFA.transiciones!.filter(transicion => transicion.origen !== '' && transicion.destino !== '');
  
    return automataDFA;
  }
  
  private cierreEpsilon(automata: AutomataNFA, estados: string[]): string[] {
    const cierre: string[] = [];
  
    const pila: string[] = [...estados];
  
    while (pila.length > 0) {
      const estadoActual = pila.pop();
      if (!cierre.includes(estadoActual!)) {
        cierre.push(estadoActual!);
      }
  
      const transicionesEpsilon = automata.transiciones.filter(
        transicion => transicion.origen === estadoActual && transicion.simbolo === 'ε'
      );
  
      for (const transicion of transicionesEpsilon) {
        if (!cierre.includes(transicion.destino)) {
          pila.push(transicion.destino);
        }
      }
    }
  
    return cierre;
  }
  
  private cierreTransicion(automata: AutomataNFA, estados: string[], simbolo: string): string[] {
    const cierre: string[] = [];
  
    for (const estado of estados) {
      const transiciones = automata.transiciones.filter(
        transicion => transicion.origen === estado && transicion.simbolo === simbolo
      );
  
      for (const transicion of transiciones) {
        if (!cierre.includes(transicion.destino)) {
          cierre.push(transicion.destino);
        }
      }
    }
  
    return this.cierreEpsilon(automata, cierre);
  }
  

}

