import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { FormComponent } from '../form/form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  enteredGoalId: string = '';
  @Output() goalId = new EventEmitter<string>();

  onSearch() {
    this.goalId.emit(this.enteredGoalId.toUpperCase());
  }
}
