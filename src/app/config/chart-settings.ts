// src/app/config/chart-settings.ts

export const chartSettings = {
    defaults: {
      currentAge: 18,
      retirementAge: 60,
      currentSavings: 0,
      targetCorpus: 0,
      monthlySavings: 0
    },
    constants: {
      monthsInYear: 12,
    },
    interest: {
      annualRate: 0.06,
    },
    labels: {
      actual: 'Actual Savings',
      target: 'Target Savings Goal',
      agePrefix: 'Age ',
    },
    colors: {
      actual: 'blue',
      target: 'green',
    },
    display: {
      fill: false,
      tension: 0.3,
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      targetBufferMultiplier: 1.1,
      borderDash: [5, 5],
      fontSize: {
        axis: 12,
        legend: 14,
      },
    },
    animate: {
      duration:800,
      framerate: 60,
      increment : 1000
    },
    
  };
  
  export function calculateFutureValue(
    current: number,
    monthly: number,
    months: number,
    rate: number
  ): number {
    return (
      current * Math.pow(1 + rate, months) +
      monthly * ((Math.pow(1 + rate, months) - 1) / rate)
    );
  }
  
  export function calculateTargetValue(
    targetCorpus: number,
    yearsLeft: number,
    rate: number
  ): number {
    return targetCorpus / Math.pow(1 + rate, yearsLeft * chartSettings.constants.monthsInYear);
  }
  
  export function currencyFormatter(value: number): string {
    return `$${value.toLocaleString()}`;
  }
  