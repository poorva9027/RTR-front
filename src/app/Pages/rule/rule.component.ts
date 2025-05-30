import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../../../Components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule',
  standalone: true,
  imports: [HeaderComponent, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.css',
})
export class RuleComponent {
  activeIndex = 0;

  @ViewChildren('tabElement') tabElements!: QueryList<ElementRef>;

  constructor(private elRef: ElementRef, private fb: FormBuilder) {}

  ngAfterViewInit() {
    setTimeout(() => this.moveIndicator(), 0); // Ensure DOM is ready
  }

  switchTab(index: number) {
    this.activeIndex = index;
    this.moveIndicator();
  }

  moveIndicator() {
    const indicator = this.elRef.nativeElement.querySelector('.tab-indicator');
    const tab = this.tabElements.toArray()[this.activeIndex].nativeElement;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.left = `${tab.offsetLeft}px`;
  }

  retirementGoal: number | null = null;

  private multiplier = 25;
  retirementForm!: FormGroup;
  activeTab: string = '25x';
  setTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.retirementForm = this.fb.group({
      monthlyExpenses: [0],
    });
  }

  calculate25xGoal(): void {
    const monthlyExpenses = this.retirementForm.value.monthlyExpenses;
    const annualExpenses = monthlyExpenses * 12;
    this.retirementGoal = annualExpenses * this.multiplier;
  }
}
