import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-no-user',
  imports: [CommonModule],
  templateUrl: './no-user.component.html',
  styleUrl: './no-user.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NoUserComponent {
  update: string = "Ok"
@Input() notFound: boolean = true;
closeNouser(){
  this.notFound = false;
}
}
