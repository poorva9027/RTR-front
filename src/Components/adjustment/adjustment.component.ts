import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Images } from '../../app/Config/images';

@Component({
  selector: 'app-adjustment',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.css'],
})
export class AdjustmentComponent {
  //Images
  OnTrackSvg = Images.Up;
  OffTrckSvg = Images.Down;

  // Inputs
  @Input() recommendedMonthly: number = 0;
  @Input() onTrack: boolean = true;

  // Outputs
  @Output() trackStatusEmitter = new EventEmitter<boolean>();

  // Local state
  recommendedMonthlySave: number = 0;
  monthlySave: number = 0;

  // Update values from child
  onRecommendedSaveChange([recommendedMonthlySave, monthlySave]: [
    number,
    number
  ]): void {
    this.recommendedMonthlySave = recommendedMonthlySave;
    this.monthlySave = monthlySave;
  }

  // Toggle onTrack status and emit
  toggleTrackStatus(): void {
    this.onTrack = !this.onTrack;
    this.trackStatusEmitter.emit(this.onTrack);
  }
}
