import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { PopBtnComponent } from '../pop-btn/pop-btn.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updated-goal',
  imports: [PopBtnComponent, CommonModule],
  templateUrl: './updated-goal.component.html',
  styleUrl: './updated-goal.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpdatedGoalComponent {
  update: string = 'Ok';
  @Input() Updated: boolean = false;

  closeUpdate() {
    this.Updated = false;
  }
}
