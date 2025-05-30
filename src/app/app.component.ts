import { Component, NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, MatTooltipModule],
})
export class AppComponent {
  title = 'myapp';
  id: string = 'RPT100';
  constructor(private router: Router) {
    // Check token every few seconds
    this.setupTokenExpirationCheck();
  }

  // Automatically remove token after 5 minutes
  setupTokenExpirationCheck() {
    // Optional: redirect immediately if token is already gone
    setInterval(() => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.router.navigate(['/login']);
      }
    }, 2000); // check every 2 seconds
  }

  @NgModule({
    imports: [MatTooltipModule],
  })
  recommendedMonthlySave: number = 0;
  onTrack: boolean = true;
  targetValue: number = 0;
  onRecommendedSaveChange([recommendedSave, targetValue]: [number, number]) {
    this.targetValue = targetValue;
    this.recommendedMonthlySave = recommendedSave;
    this.checkOnTrack();
  }

  checkOnTrack() {
    this.onTrack = this.targetValue >= this.recommendedMonthlySave;
  }
  onTrackStatusChange(status: boolean) {
    this.onTrack = status;
  }
  isValid: boolean = false;

  onFormValidChange(formValid: boolean) {
    this.isValid = formValid;
    console.log('Form valid?', formValid);
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
}
