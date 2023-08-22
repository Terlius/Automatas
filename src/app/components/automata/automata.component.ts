import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AutomataService, AutomataDFA, AutomataNFA } from 'src/app/services/automata.service';
import {  Network } from 'vis-network';
import { DataSet } from 'vis-network/standalone';


@Component({
  selector: 'app-automata',
  templateUrl: './automata.component.html',
  styleUrls: ['./automata.component.css']
})
export class AutomataComponent {
  
  fGroup: FormGroup = new  FormGroup({});
  
  

  constructor(
    private fb: FormBuilder,
    private automataService: AutomataService

  ) {  
  }

  ngOnInit(): void {

    this.fGroup = this.fb.group({
      estados: ['', Validators.required],
      alfabeto: ['', Validators.required],
      estadoInicial: ['', Validators.required],
      estadosFinales: ['', Validators.required],
      transiciones: this.fb.array([])
    });


    //this.convertirAutomat();
  }



  convertirAutomat() {
    const automataNFA = {
      estados: ['Q0', 'Q1', 'Q2','Q3', 'Q4', 'Q5','Q6', 'Q7'],
      alfabeto: ['a', 'b'],
      estadoInicial: 'Q0',
      estadosFinales: ['Q7'],
      transiciones: [
        { origen: 'Q0', simbolo: 'ε', destino: 'Q1' },
        { origen: 'Q0', simbolo: 'ε', destino: 'Q5' },
        { origen: 'Q1', simbolo: 'a', destino: 'Q2' },
        { origen: 'Q2', simbolo: 'ε', destino: 'Q3' },
        { origen: 'Q3', simbolo: 'b', destino: 'Q4' },
        { origen: 'Q4', simbolo: 'ε', destino: 'Q7' },
        { origen: 'Q5', simbolo: 'a', destino: 'Q6' },
        { origen: 'Q6', simbolo: 'ε', destino: 'Q7' },
      ]
    };

    const automataNFA2 = {
      estados: ['A', 'B', 'C'],
      alfabeto: ['0', '1'],
      estadoInicial: 'A',
      estadosFinales: ['C'],
      transiciones: [
        { origen: 'A', simbolo: '0', destino: 'B' },
        { origen: 'A', simbolo: '1', destino: 'A' },
        { origen: 'A', simbolo: '0', destino: 'A' },
        { origen: 'B', simbolo: '0', destino: 'C' }
      ]
    };



    const automataDFA = this.automataService.convertirAutomataNFAaDFA(automataNFA);
    this.graficarAutomata(automataDFA);
    console.log(automataDFA); 
  }

  graficarAutomata(automataDFA: AutomataDFA): void {
    const container = document.getElementById('network');
  
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();
  
    // Agregar nodos al dataset
    for (const estado of automataDFA.estados) {
      const isEstadoInicial = estado === automataDFA.estadoInicial;
      const isEstadoFinal = automataDFA.estadosFinales.includes(estado);
  
      const node = {
        id: estado,
        label: estado,
        color: {
          background: isEstadoInicial ? 'lightblue' : isEstadoFinal ? 'lightgreen' : 'white',
          border: isEstadoFinal ? 'green' : 'black',
        },
      };
  
      nodes.add(node);
    }
  
    // Agregar aristas al dataset
    for (const transicion of automataDFA.transiciones!) {
      const edge = {
        from: transicion.origen,
        to: transicion.destino,
        label: transicion.simbolo,
        arrows: 'to', // Flecha en una dirección (opcional: 'from', 'to, from')
      };
  
      edges.add(edge);
    }
  
    // Eliminar nodo vacío si existe
    nodes.remove({ id: '' });
  
    // Crear la red de grafos
    const data = {
      nodes: nodes,
      edges: edges,
    };
  
    const options = {};
    const network = new Network(container!, data, options);
  }




  crearAutomata(): void {
    if (this.fGroup.invalid) {
      return;
    }

    const automataDFA = this.automataService.convertirAutomataNFAaDFA(this.fGroup.value);
    this.graficarAutomata(automataDFA);
  }

  ///Metodos para el formulario de automatas

  convertirAFN(): void {
    if (this.fGroup.valid) {
      const formValue = this.fGroup.value;
  
      const automataNFA: AutomataNFA = {
        estados: formValue.estados.split(',').map((estado: string) => estado.trim()),
        alfabeto: formValue.alfabeto.split(',').map((simbolo: string) => simbolo.trim()),
        estadoInicial: formValue.estadoInicial.trim(),
        estadosFinales: formValue.estadosFinales.split(',').map((estado: string) => estado.trim()),
        transiciones: formValue.transiciones.map((transicion: any) => {
          return {
            origen: transicion.origen.trim(),
            simbolo: transicion.simbolo.trim(),
            destino: transicion.destino.trim()
          };
        })
      };
  
      const automataDFA = this.automataService.convertirAutomataNFAaDFA(automataNFA);
      this.graficarAutomata(automataDFA);
    }
  }
  // Obtener el control del array de transiciones
  get transiciones(): FormArray {
    return this.fGroup.get('transiciones') as FormArray;
  }

  // Agregar una nueva transición
  agregarTransicion(): void {
    this.transiciones.push(this.createTransicionFormGroup());
  }

  // Eliminar una transición
  eliminarTransicion(index: number): void {
    this.transiciones.removeAt(index);
  }

  // Función para crear el FormGroup para una transición
  createTransicionFormGroup(): FormGroup {
    return this.fb.group({
      origen: ['', Validators.required],
      simbolo: ['', Validators.required],
      destino: ['', Validators.required]
    });
  }

  // Manejar el envío del formulario
  


}