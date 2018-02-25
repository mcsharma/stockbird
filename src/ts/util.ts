export function formatInt(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatFloat(x): string {
  if (x === null) {
    return '...';
  }
  return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatGainOrLoss(current: number, previous: number, options: any = {
  showCurrentValue: false,
  showPercent: true,
}) {
  const gain = current - previous;
  const value = options.showCurrentValue ? current : gain;
  let ans = formatFloat(value);
  if (!options.showCurrentValue && value > 1e-6 && ans[0] !== '-') {
    ans = '+' + ans;
  }
  if (options.showPercent && Math.abs(previous) > 1e-6) {
    ans += ' (';
    if (options.showCurrentValue && current - previous > 1e-6) {
      ans += '+';
    }
    ans += (gain / previous * 100).toFixed(2) + '%)';
  }
  return ans;
}
