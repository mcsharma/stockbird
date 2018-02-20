import React = require('react');
import '../../css/pf-summary.less';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import {PFTradeItem} from '../types/pf-trade-items';
import classNames = require('classnames');
import {format} from '../util';

type Props = {
  assets: OrderedMap<PFSymbol, List<PFTradeItem>>,
  marketData: PFSymbolToStockDataPoint,
};

export class PFSummary extends React.Component<Props> {
  render() {
    let totalBasis = 0;
    let totalValue = 0;
    let isFetching = false;
    this.props.assets.forEach((rows, key) => {
      rows.forEach((row) => {
        totalBasis += row.quantity * row.basis;

        if (isFetching) {
          return;
        }
        const symbolData = this.props.marketData[row.symbol];
        if (!symbolData) {
          isFetching = true;
          return;
        }
        totalValue += row.quantity * symbolData.latestPrice;
      })
    });

    let profitText = '';
    const profit = isFetching ? null : totalValue - totalBasis;
    let isNeutral = isFetching || Math.abs(totalBasis - totalValue) < 1e-6;
    let hasProfit = !isNeutral && totalValue > totalBasis;
    let hasLoss = !isNeutral && totalValue < totalBasis;
    if (profit !== null) {
      profitText = profit.toFixed(2);
      if (hasProfit) {
        profitText = '+' + profitText;
      }
    }

    let profitPercent = null;
    if (profit !== null && totalBasis > 0) {
      profitPercent = (profit / totalBasis * 100).toFixed(2);
    }

    return <div className="pf-summary">
      <div>
        <div className="pf-summary-item-label">Gain/Loss</div>
        <div
          className={classNames({'pf-color-red': hasLoss, 'pf-color-green': hasProfit})}>
          {isFetching ? '...' : format(profitText)} {profitPercent === null ? '' : '(' + profitPercent + '%)'}
        </div>
      </div>
      <div>
        <div className="pf-summary-item-label">Total Value</div>
        <div> {isFetching ? '...' : format(totalValue.toFixed(2))}</div>
      </div>
      <div>
        <div className="pf-summary-item-label">Cost Basis</div>
        <div> {format(totalBasis.toFixed(2))}</div>
      </div>
    </div>;
  }
}
