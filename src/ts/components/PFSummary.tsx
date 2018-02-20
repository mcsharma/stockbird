import React = require('react');
import '../../css/pf-summary.less';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import {PFTradeItem} from '../types/pf-trade-items';
import classNames = require('classnames');
import {numberWithCommas} from '../util';

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
        totalValue += row.quantity * symbolData.realtime;
      })
    });

    let profitText = '';
    const profit = isFetching ? null : totalValue - totalBasis;
    let hasProfit = isFetching ? null : totalValue > totalBasis;
    if (profit !== null) {
      profitText = profit.toFixed(2);
      if (hasProfit) {
        profitText = '+' + profitText;
      }
    }

    let profitPercent = null;
    if (profit !== null) {
      profitPercent = (profit / totalBasis * 100).toFixed(2);
    }

    return <div className="pf-summary">
      <div>
        <div className="pf-summary-item-label">Gain/Loss</div>
        <div
          className={classNames({'pf-color-red': !hasProfit, 'pf-color-green': hasProfit})}>
          {isFetching ? '...' : numberWithCommas(profitText)} {profitPercent === null ? '' : '(' + profitPercent + '%)'}
        </div>
      </div>
      <div>
        <div className="pf-summary-item-label">Total Value</div>
        <div> {isFetching ? 'fetching...' : numberWithCommas(totalValue.toFixed(2))}</div>
      </div>
      <div>
        <div className="pf-summary-item-label">Cost Basis</div>
        <div> {numberWithCommas(totalBasis.toFixed(2))}</div>
      </div>
    </div>;
  }
}
