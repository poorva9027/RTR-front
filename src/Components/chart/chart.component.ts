import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { RetirementFormService } from '../../Services/retirement-form.service';
import { calculateFutureValue, calculateTargetValue, chartSettings } from '../../app/Config/chart-settings';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  formData: any;
  chart: Chart | undefined;
  isViewInitialized = false;

  constructor(private dataService: RetirementFormService) {}

  ngOnInit(): void {
    this.dataService.formData$.subscribe((data) => {
      this.formData = data;

      // Wait for view init before rendering chart
      if (this.isViewInitialized) {
        const token = localStorage.getItem('access_token');
        if (token) {
          this.updateChart();
        }
      } else {
        // Safe fallback in case view is not yet initialized
        setTimeout(() => this.updateChart(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
  }

  updateChart(): void {
    const ctx = document.getElementById('retirementChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Extract data from form or use defaults
    const currentAge = this.formData?.currentAge || chartSettings.defaults.currentAge;
    const retirementAge = this.formData?.targetAge || chartSettings.defaults.retirementAge;
    const currentSavings = this.formData?.currentSave || chartSettings.defaults.currentSavings;
    const targetCorpus = this.formData?.targetSave || chartSettings.defaults.targetCorpus;
    const monthlySave = this.formData?.monthlSave || chartSettings.defaults.monthlySavings;
    const monthlyRate = chartSettings.interest.annualRate / chartSettings.constants.monthsInYear;

    const years: string[] = [];
    const actualSavings: number[] = [];
    const targetSavings: number[] = [];

    // Generate chart data year-wise
    for (let age = currentAge; age <= retirementAge; age++) {
      const months = (age - currentAge) * chartSettings.constants.monthsInYear;
      const futureValue = calculateFutureValue(currentSavings, monthlySave, months, monthlyRate);
      const target = calculateTargetValue(targetCorpus, retirementAge - age, monthlyRate);

      actualSavings.push(Math.round(futureValue));
      targetSavings.push(Math.round(target));
      years.push(`${chartSettings.labels.agePrefix}${age}`);
    }

    // Destroy existing chart if any
    if (this.chart) {
      this.chart.destroy();
    }

    // Create a new Chart
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: chartSettings.labels.actual,
            data: actualSavings,
            borderColor: chartSettings.colors.actual,
            fill: chartSettings.display.fill,
            tension: chartSettings.display.tension,
          },
          {
            label: chartSettings.labels.target,
            data: targetSavings,
            borderColor: chartSettings.colors.target,
            borderDash: chartSettings.chartOptions.borderDash,
            fill: chartSettings.display.fill,
            tension: chartSettings.display.tension,
          },
        ],
      },
      options: {
        responsive: chartSettings.chartOptions.responsive,
        maintainAspectRatio: chartSettings.chartOptions.maintainAspectRatio,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: targetCorpus * chartSettings.chartOptions.targetBufferMultiplier,
            ticks: {
              callback: (tickValue: string | number) => {
                const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
                return value;
              },
              font: {
                size: chartSettings.chartOptions.fontSize.axis,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: chartSettings.chartOptions.fontSize.axis,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: chartSettings.chartOptions.fontSize.legend,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw as number}`;
              },
            },
          },
        },
      },
    });
  }
}
