import {PFTradeItem} from './types/pf-trade-items';
import {StockDataPoint} from './types/types';

export function formatInt(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatFloat(x): string {
  if (x === null) {
    return '...';
  }
  return formatInt(x.toFixed(2));
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

export function getNetAssetValue(transactions: PFTradeItem[], marketData?: StockDataPoint) {
  let ans = 0;
  if (!marketData) {
    return ans;
  }
  transactions.forEach((transaction) => {
    ans += transaction.quantity * marketData.latestPrice;
  });
  return ans;
}

export function getUnsoldCostBasis(transactions: PFTradeItem[]) {
  let ans = 0;
  transactions.forEach((transaction) => {
    if (transaction.sellPrice === null) {
      ans += transaction.quantity * transaction.basis;
    }
  });
  return ans;
}


export function getNetAssetPrevCloseValue(transactions: PFTradeItem[], marketData?: StockDataPoint) {
  let ans = 0;
  if (!marketData) {
    return ans;
  }
  transactions.forEach((transaction) => {
    ans += transaction.quantity * marketData.previousClose;
  });
  return ans;
}
