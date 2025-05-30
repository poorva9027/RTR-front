import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

// Importing child components
import { FormComponent } from '../../../Components/form/form.component';
import { SearchComponent } from '../../../Components/search/search.component';
import { HeaderComponent } from '../../../Components/header/header.component';
import { CreatedGoalComponent } from '../../../Components/created-goal/created-goal.component';
import { NoUserComponent } from '../../../Components/no-user/no-user.component';
import { UpdatedGoalComponent } from '../../../Components/updated-goal/updated-goal.component';
import { AdjustmentComponent } from '../../../Components/adjustment/adjustment.component';
import { MonthlyContribComponent } from '../../../Components/monthly-contrib/monthly-contrib.component';
import { SaveComponent } from '../../../Components/btn/save/save.component';
import { EditComponent } from '../../../Components/btn/edit/edit.component';
import { UpdateComponent } from '../../../Components/btn/update/update.component';
import { ChartComponent } from '../../../Components/chart/chart.component';
import { DiscardComponent } from '../../../Components/btn/discard/discard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    FormComponent,
    MonthlyContribComponent,
    SaveComponent,
    EditComponent,
    UpdateComponent,
    AdjustmentComponent,
    ChartComponent,
    CreatedGoalComponent,
    MatTooltipModule,
    UpdatedGoalComponent,
    NoUserComponent,
    DiscardComponent,
    HeaderComponent,
    
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Reference to child FormComponent
  @ViewChild(FormComponent) formComponent!: FormComponent;

  // Dashboard data variables
  recommendedMonthlySave = 0;
  targetValue = 0;
  onTrack = true;
  isValid = false;

  // Goal-related IDs
  goalId = '';           // Generated Goal ID after form submission
  selectedGoalId = '';   // Goal ID retrieved from search
  showID = false;        // Toggle to display goal ID

  // State flags
  Status = false;        // Indicates user not found
  Updated = false;       // Indicates goal update success
  enableDash = false;    // Unused toggle (can be linked to access control or UI toggle)

  // Mode control flags
  isSaveMode = true;
  isEditMode = false;
  isUpdateMode = false;
  isDiscard = false;

  /**
   * Handles the Save button click by submitting the form.
   */
  handleSave() {
    this.formComponent.submitForm();
  }

  /**
   * Reverts form changes when Discard is clicked.
   */
  handleDiscard() {
    if (this.isValid) {
      this.formComponent.disableFormForEdit();
      this.formComponent.discardChanges();
      this.isDiscard = false;
      this.isUpdateMode = false;
      this.isEditMode = true;
    }
  }

  /**
   * Enables the form fields for editing.
   */
  handleEdit() {
    if (this.isValid) {
      this.formComponent.enableFormForEdit();
      this.isEditMode = false;
      this.isUpdateMode = true;
      this.isSaveMode = false;
      this.isDiscard = true;
    }
  }

  /**
   * Submits the updated form data and toggles UI states.
   */
  handleUpdate() {
    if (this.isValid) {
      this.formComponent.updateform();
      this.handleUpdateStatus(true);
      this.formComponent.disableFormForEdit();
      this.isUpdateMode = false;
      this.isEditMode = true;
      this.isDiscard = false;
      this.isSaveMode = false;
    }
  }

  /**
   * Updates recommended savings and target value from child.
   */
  onRecommendedSaveChange([recommendedSave, target]: [number, number]) {
    this.recommendedMonthlySave = recommendedSave;
    this.targetValue = target;
    this.onTrack = target >= recommendedSave;
  }

  /**
   * Sets onTrack status from a child component.
   */
  onTrackStatusChange(status: boolean) {
    this.onTrack = status;
  }

  /**
   * Receives form validation status from child component.
   */
  onFormValidChange(isFormValid: boolean) {
    this.isValid = isFormValid;
    console.log('Form valid?', isFormValid);
  }

  /**
   * Called when a searched goal is not found.
   * Resets UI to initial save state.
   */
  showUsernotfound(status: boolean) {
    this.Status = status;
    if (status) {
      this.resetToSaveMode();
    }
  }

  /**
   * Handles form submission and switches UI to edit mode.
   */
  handleFormSubmitted(goalId: string) {
    console.log('Form submitted, goal ID:', goalId);
    this.goalId = goalId;
    this.showID = true;
    this.isSaveMode = false;
    this.isEditMode = true;
    this.isUpdateMode = false;
    this.formComponent.disableFormForEdit();
  }

  /**
   * Temporarily displays update success message.
   */
  handleUpdateStatus(status: boolean) {
    this.Updated = status;
    if (status) {
      setTimeout(() => {
        this.Updated = false;
      }, 3000);
    }
  }

  /**
   * Called when a goal is fetched from search.
   */
  onGoalIdFromSearch(goalId: string) {
    this.selectedGoalId = goalId;
    this.isValid = true;
    this.isSaveMode = false;
    this.isEditMode = true;
    this.isUpdateMode = false;
  }

  /**
   * Resets the dashboard to its initial save mode state.
   */
  resetToSaveMode() {
    this.isSaveMode = true;
    this.isEditMode = false;
    this.isUpdateMode = false;
    this.selectedGoalId = '';
  }
}
