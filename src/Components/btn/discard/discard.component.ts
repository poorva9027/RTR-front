import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-discard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discard.component.html',
  styleUrl: './discard.component.css',
})
export class DiscardComponent {
  @Input() isDiscard: boolean = false;
}
