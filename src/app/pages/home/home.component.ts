import { Component, computed, signal, effect, Injector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task} from './../../models/task.model';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
    // {
    //   id: Date.now(),
    //   title: 'Crear Proyecto',
    //   completed: false
    // },
    // {
    //   id: Date.now(),
    //   title: 'Crear Componentes',
    //   completed: false
    // },
    // {
    //   id: Date.now(),
    //   title: 'Crear Servicio',
    //   completed: false
    // },
   
  ]);
//Estados computados en base a otros estados
  filter = signal<'all'| 'pending' | 'completed'> ('all');
  tasksByFilter = computed(()=>{
    //elementos a reaccionar cuando cambian 
    const filter = this.filter();
    const tasks = this. tasks();
    if (filter ==='pending') {
      return tasks.filter (task => !task.completed);
    } 
   if (filter === 'completed') {
    return tasks.filter(task => task.completed);
   }
   return tasks;
  })

  newTaskControl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
      
    ]
  });

  // changeHandler(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   const newTask = input.value;
  //   this.tasks.update((tasks) => [...tasks, newTask]);
  //   this.addTask(newTask);

  // }

injector = inject(Injector)
  constructor(){
    //computed retorna, effect no
    //Vigila cuando un estado cambia, y permite ejecutar una logica a partir de el

  
  }
  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks(){
    effect(() => {
      const tasks = this.tasks();
      console.log('run effect');
      localStorage.setItem('tasks', JSON.stringify(tasks));

    },{ injector: this.injector});
  }

  changeHandler(){  
    if (this.newTaskControl.valid){
      const value = this.newTaskControl.value.trim();
      //trim quita espacios de inciio y final 
      if(value !== ''){ // La tarea solo se crea si no hay valores vacios
        this.addTask(value);
        this.newTaskControl.setValue('');
      }     
    } 
  }
  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title, 
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number){
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }

  updateTask(index: number){
    //algoritmo basado en metods inmutables
    this.tasks.update((tasks)=>{
      return tasks.map((task, position) =>{
        if (position === index){
          return{
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

updateTaskEditingMode(index: number){
 this.tasks.update(prevState =>{
  return prevState.map((task, position) => {
    if (position === index){
      return{
        ... task,
        editing: true
      }
    }
    return {
      ...task,
      editing:false
    };
  })
 })
}

updateTaskText(index: number, event: Event){
  const input = event.target as HTMLInputElement;
  this.tasks.update(prevState =>{
   return prevState.map((task, position) => {
     if (position === index){
       return{
         ... task,
         title: input.value,
         editing: false
       }
     }
     return task;
   })
  })
 }

 changeFilter(filter: 'all'| 'pending' | 'completed'){
  this.filter.set(filter);
 }


}
