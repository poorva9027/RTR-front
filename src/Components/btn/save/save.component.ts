import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './save.component.html',
  styleUrl: './save.component.css',
})
export class SaveComponent {
  @Input() isSave: boolean = false;
}
