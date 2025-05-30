import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-btn',
  imports: [],
  templateUrl: './pop-btn.component.html',
  styleUrl: './pop-btn.component.css',
})
export class PopBtnComponent {
  @Input() value: string = '';
  @Output() click = new EventEmitter<void>();

  handleClick() {
    this.click.emit();
  }
}
