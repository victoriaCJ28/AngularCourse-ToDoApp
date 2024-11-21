import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = "Bienvenido a mi primera aplicación";
  tasks = signal( [
    'Instalar Angular CLI',
    'Crear proyecto',
    'Crear componentes',
    'Crear servicio'
  ]);
  name = signal('Victoria');
  age = 32;
  disabled: boolean = true;
  img = 'https://w3schools.com/howto/img_avatar.png';

  person = signal({
    name: 'Victoria',
    age: 18,
    avatar: 'https://w3schools.com/howto/img_avatar.png'
  });
  clickHandler(){
    alert('hola')
  }
  changeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue)
   // console.log(event);
    console.log(input.value);

  }
  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  
  }

  changeAge(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState =>{
      return{
        ...prevState, 
        age: parseInt(newValue, 10)
      }
    });
  }
}
