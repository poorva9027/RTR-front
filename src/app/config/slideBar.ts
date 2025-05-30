export const GradientConfig = {
  getLinearGradient: (fillPercentage: number): string =>
    `linear-gradient(to right, #006EFF ${fillPercentage}%, #e1e1e1 ${fillPercentage}%)`
};
