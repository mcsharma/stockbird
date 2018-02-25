export function formatNum(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPercent(x: number, options: any = {needSign: true}) {
  let ans = formatNum(x.toFixed(2)) + '%';
  if (options.needSign && ans[0] !== '-') {
    ans = '+' + ans;
  }
  return ans;
}

export function formatGainOrLoss(current: number, previous: number, options: any = {
  showCurrentValue: false,
  showPercent: true,
}) {
  const gain = current - previous;
  const value = options.showCurrentValue ? current : gain;
  let ans = formatNum(value.toFixed(2));
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
