import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { RetirementFormService } from '../../Services/retirement-form.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from '../../app/Config/slideBar';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, AfterViewInit {
  retirementForm: FormGroup;
  isSearching: boolean = false;
  @Input() userStatus: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();
  @Output() userStatusChange = new EventEmitter<boolean>();
  @Output() formSubmitted = new EventEmitter<string>();
  @Output() formUpdate = new EventEmitter<boolean>();
  @Input() goalSearchId: string = '';
  isSubmitting = false;
  submitError: string | null = null;
  private submitCooldown = false;

  constructor(
    private dataService: RetirementFormService,
    private translate: TranslateService
  ) {
    this.retirementForm = new FormGroup(
      {
        currentAge: new FormControl('22', [
          Validators.required,
          Validators.min(18),
          Validators.max(60),
        ]),
        currentSave: new FormControl('0', [
          Validators.required,
          Validators.min(0),
          Validators.max(100000),
        ]),
        monthlSave: new FormControl('0', [
          Validators.required,
          Validators.min(0),
          Validators.max(10000),
        ]),
        targetAge: new FormControl('35', [
          Validators.required,
          Validators.min(18),
          Validators.max(60),
        ]),
        targetSave: new FormControl('0', [
          Validators.required,
          Validators.min(0),
          Validators.max(1000000),
        ]),
      },
      { validators: this.targetAgeGreaterThanCurrentAge }
    );
  }

  ngOnInit(): void {
    this.retirementForm.markAllAsTouched();
    this.retirementForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((values) => {
        if (this.retirementForm.disabled) return;

        this.formValidChange.emit(this.retirementForm.valid);

        if (this.retirementForm.valid) {
          this.dataService.updateFormData(values);
        } else {
          this.dataService.updateFormData(null);
        }
      });

    if (this.isSearching) {
      this.retirementForm.disable();
    }
  }

  ngAfterViewInit() {
    const sliders = document.querySelectorAll<HTMLInputElement>('input.slider');

    sliders.forEach((slider) => {
      this.updateSliderBackground(slider);

      slider.addEventListener('input', (event) => {
        this.onSliderInput(event);
      });
    });
  }

  onSliderInput(event: Event) {
    const slider = event.target as HTMLInputElement;
    this.updateSliderBackground(slider);
  }

  updateSliderBackground(slider: HTMLInputElement) {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const value = Number(slider.value);

    const fillPercentage = ((value - min) / (max - min)) * 100;

    slider.style.background = GradientConfig.getLinearGradient(fillPercentage);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.retirementForm.get(controlName);
    if (!control) return false;

    if (errorType === 'required') {
      return control.hasError('required');
    }

    if (
      controlName === 'targetAge' &&
      errorType === 'targetAgeLessThanCurrentAge'
    ) {
      return this.retirementForm.hasError('targetAgeLessThanCurrentAge');
    }

    return (control.touched || control.dirty) && control.hasError(errorType);
  }

  updateSlider(controlName: string, event: any): void {
    const sliders = {
      currentAge: 'currentAgeSlider',
      currentSave: 'currentSaveSlider',
      monthlSave: 'monthlSaveSlider',
      targetAge: 'targetAgeSlider',
      targetSave: 'targetSaveSlider',
    };

    const value = event.target.value;
    const sliderId = sliders[controlName as keyof typeof sliders];
    const slider = document.getElementById(sliderId) as HTMLInputElement;

    if (slider) {
      slider.value = value;

      this.updateSliderBackground(slider);
    }
  }

  updateInput(controlName: string, event: any): void {
    const value = event.target.value;
    this.retirementForm.get(controlName)?.setValue(value);
    this.retirementForm.get(controlName)?.markAsTouched();

    this.updateSlider(controlName, event);
  }

  getErrorMessage(controlName: string): string {
    const control = this.retirementForm.get(controlName);
    const fieldName = this.translate.instant(
      `FORM.${controlName.toUpperCase()}`
    );

    if (control?.hasError('required')) {
      return this.translate.instant('VALIDATION.REQUIRED', {
        field: fieldName,
      });
    }

    const errorParams = {
      field: fieldName,
      min: control?.getError('min')?.min,
      max: control?.getError('max')?.max,
    };

    if (controlName === 'currentAge' || controlName === 'targetAge') {
      if (control?.hasError('min'))
        return this.translate.instant('VALIDATION.AGE_MIN', errorParams);
      if (control?.hasError('max'))
        return this.translate.instant('VALIDATION.AGE_MAX', errorParams);
    }
    if (controlName === 'currentSave') {
      if (control?.hasError('min'))
        return this.translate.instant('VALIDATION.SAVINGS_MIN', errorParams);
      if (control?.hasError('max'))
        return this.translate.instant('VALIDATION.SAVINGS_MAX', errorParams);
    }
    if (controlName === 'monthlSave') {
      if (control?.hasError('min'))
        return this.translate.instant('VALIDATION.MONTHLY_MIN', errorParams);
      if (control?.hasError('max'))
        return this.translate.instant('VALIDATION.MONTHLY_MAX', errorParams);
    }
    if (controlName === 'targetSave') {
      if (control?.hasError('min'))
        return this.translate.instant('VALIDATION.TARGET_MIN', errorParams);
      if (control?.hasError('max'))
        return this.translate.instant('VALIDATION.TARGET_MAX', errorParams);
    }
    if (
      controlName === 'targetAge' &&
      this.retirementForm.hasError('targetAgeLessThanCurrentAge')
    ) {
      return this.translate.instant('VALIDATION.TARGET_AGE_GREATER');
    }
    return '';
  }

  targetAgeGreaterThanCurrentAge(
    group: AbstractControl
  ): ValidationErrors | null {
    const currentAge = group.get('currentAge')?.value;
    const targetAge = group.get('targetAge')?.value;

    if (
      currentAge &&
      targetAge &&
      parseInt(targetAge) <= parseInt(currentAge)
    ) {
      return { targetAgeLessThanCurrentAge: true };
    }

    return null;
  }

  prepareFormData(): any {
    const formValues = this.retirementForm.value;

    return {
      currentAge: Number(formValues.currentAge),
      retirementAge: Number(formValues.targetAge),
      currentSavings: Number(formValues.currentSave),
      targetSavings: Number(formValues.targetSave),
      monthlyContribution: Number(formValues.monthlSave),
      createdAt: new Date().toISOString(),
    };
  }

  goalId: string = '';

  public submitForm() {
    if (this.submitCooldown) {
      alert('Please wait before submitting again.');
      this.submitError = 'Please wait a moment before submitting again.';
      return;
    }

    if (this.retirementForm.valid) {
      const payload = this.prepareFormData();

      this.dataService.saveRetirementGoal(payload).subscribe({
        next: (response) => {
          console.log('Goal saved successfully!', response);
          this.formSubmitted.emit(response.id);

          this.goalId = response.id.toUpperCase();

          // Save current form state so it can be restored on discard
          this.originalFormData = JSON.parse(
            JSON.stringify(this.retirementForm.value)
          );

          this.startSubmitCooldown();
        },
        error: (error) => {
          console.error('Error saving goal', error);
          this.submitError = 'Failed to save goal. Please try again.';
        },
      });
    }
  }

  private startSubmitCooldown() {
    this.submitCooldown = true;
    setTimeout(() => {
      this.submitCooldown = false;
      this.submitError = null;
    }, 5000);
  }

  public updateform() {
    if (this.submitCooldown) {
      alert('Please wait before submitting again.');
      this.submitError = 'Please wait a moment before submitting again.';
      return;
    }

    if (this.retirementForm.valid) {
      const payload = this.prepareFormData();

      if (this.goalSearchId && this.goalSearchId.trim() !== '') {
        this.dataService
          .updateRetirementGoal(this.goalSearchId, payload)
          .subscribe({
            next: (response) => {
              console.log('Goal updated successfully!', response);
              this.formUpdate.emit(true);
              this.startSubmitCooldown();
            },
            error: (error) => {
              console.error('Error updating goal', error);
              this.submitError = 'Failed to update goal. Please try again.';
            },
          });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['goalSearchId'] && changes['goalSearchId'].currentValue) {
      this.loadGoalData(changes['goalSearchId'].currentValue);
    }
  }

  originalFormData: any;
  loadGoalData(goalSearchId: string) {
    this.dataService.getRetirementGoalById(goalSearchId).subscribe({
      next: (data) => {
        this.userStatusChange.emit(false);

        this.originalFormData = {
          currentAge: data.currentAge,
          targetAge: data.retirementAge,
          currentSave: data.currentSavings,
          targetSave: data.targetSavings,
          monthlSave: data.monthlyContribution,
        };

        this.retirementForm.patchValue(this.originalFormData);
        this.dataService.updateFormData(this.retirementForm.getRawValue());

        this.retirementForm.disable();
        this.disableSliders(true);
      },
      error: (err) => {
        console.error('Search failed', err);
        setTimeout(() => {
          this.userStatusChange.emit(true);
        }, 100);
      },
    });
  }

  discardChanges(): void {
    if (this.originalFormData) {
      this.retirementForm.patchValue(this.originalFormData);
      this.retirementForm.markAsPristine();
      this.retirementForm.markAsUntouched();

      // Update sliders and other UI elements if needed
      Object.keys(this.originalFormData).forEach((key) => {
        const control = this.retirementForm.get(key);
        if (control) {
          const event = { target: { value: this.originalFormData[key] } };
          this.updateSlider(key, event); // Ensure this updates your sliders or other custom controls
        }
      });
    }
  }

  disableSliders(hide: boolean = false) {
    const sliders = document.querySelectorAll<HTMLInputElement>('input.slider');
    sliders.forEach((slider) => {
      if (hide) {
        slider.style.display = 'none';
      } else {
        slider.style.display = 'inline-block';
        slider.disabled = false;
      }
    });
  }

  disableFormForEdit() {
    this.retirementForm.disable();
    this.disableSliders(true);
  }
  enableFormForEdit() {
    this.retirementForm.enable();
    this.disableSliders(false);
    const controlNames = [
      'currentAge',
      'currentSave',
      'monthlSave',
      'targetAge',
      'targetSave',
    ];
    controlNames.forEach((controlName) => {
      const control = this.retirementForm.get(controlName);
      if (control) {
        const event = { target: { value: control.value } };
        this.updateSlider(controlName, event);
      }
    });
  }
}
