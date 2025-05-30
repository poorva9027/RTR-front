import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RetirementFormService } from '../../Services/retirement-form.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { chartSettings } from '../../app/Config/chart-settings';
import { Images } from '../../app/Config/images';

@Component({
  selector: 'app-monthly-contrib',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, TranslateModule],
  templateUrl: './monthly-contrib.component.html',
  styleUrls: ['./monthly-contrib.component.css'],
})
export class MonthlyContribComponent implements OnInit {
  CurrentSvg = Images.CurrentSvg;
  RecommSvg = Images.RecommSvg;
  TargetSvg = Images.TargetSvg;

  formData: any;
  animatedRecommendedValue: number = 0;
  animatedActualValue: number = 0;
  recommendedMonthlySave: number = 0;
  animatedTotalSavings: number = 0;
  expectedTotalSavings: number = 0;
  monthlySave: number = 0;

  @Input() id = 0;
  @Output() recommendedSaveEmitter = new EventEmitter<[number, number]>();

  constructor(private dataService: RetirementFormService) {}

  ngOnInit(): void {
    this.dataService.formData$.subscribe((data) => {
      this.formData = data;
      this.calculateMonthly();
    });
  }

  prepareFormData(): any {
    return {
      currentAge:
        this.formData?.currentAge || chartSettings.defaults.currentAge,
      retirementAge:
        this.formData?.targetAge || chartSettings.defaults.retirementAge,
      currentSavings:
        this.formData?.currentSave || chartSettings.defaults.currentSavings,
      targetSavings:
        this.formData?.targetSave || chartSettings.defaults.targetCorpus,
      monthlyContribution:
        this.formData?.monthlSave || chartSettings.defaults.monthlySavings,
      createdAt: new Date().toISOString(),
    };
  }

  public calculateMonthly() {
    const payload = this.prepareFormData();

    this.dataService.calculateMonthly(payload).subscribe({
      next: (response) => {
        this.recommendedMonthlySave = response.requiredMonthlySavings;

        this.monthlySave =
          this.formData?.monthlSave || chartSettings.defaults.monthlySavings;
        const currentAge =
          this.formData?.currentAge || chartSettings.defaults.currentAge;
        const retirementAge =
          this.formData?.targetAge || chartSettings.defaults.retirementAge;
        const currentSavings =
          this.formData?.currentSave || chartSettings.defaults.currentSavings;

        const monthlyRate =
          chartSettings.interest.annualRate /
          chartSettings.constants.monthsInYear;
        const totalMonths =
          (retirementAge - currentAge) * chartSettings.constants.monthsInYear;

        this.expectedTotalSavings =
          currentSavings * Math.pow(1 + monthlyRate, totalMonths) +
          this.monthlySave *
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

        this.animateValue(
          this.expectedTotalSavings,
          (val) => (this.animatedTotalSavings = val)
        );
        this.animateValue(
          this.recommendedMonthlySave,
          (val) => (this.animatedRecommendedValue = val)
        );
        this.animateValue(
          this.monthlySave,
          (val) => (this.animatedActualValue = val)
        );

        this.recommendedSaveEmitter.emit([
          this.recommendedMonthlySave,
          this.monthlySave,
        ]);
      },
      error: (error) => {
        console.error('Error goal', error);
      },
    });
  }

  animateValue(target: number, setter: (val: number) => void) {
    let currentValue = 0;
    const duration = chartSettings.animate.duration;
    const frameRate = chartSettings.animate.framerate;
    const increment =
      target / (duration / (chartSettings.animate.increment / frameRate));

    const interval = setInterval(() => {
      if (currentValue < target) {
        currentValue += increment;
        setter(Math.floor(currentValue));
      } else {
        clearInterval(interval);
        setter(Math.round(target));
      }
    }, 1000 / frameRate);
  }
}
