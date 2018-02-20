import React = require('react');
import {PFTradeItem} from '../types/pf-trade-items';
import {PFSymbolToStockDataPoint} from '../types/types';
import '../../css/pf-aggregated-row.less';

import classNames = require('classnames');
import {numberWithCommas} from '../util';

type Props = {
  transactions: PFTradeItem[],
  marketData: PFSymbolToStockDataPoint,
};

type State = {
  expanded: boolean;
}

export class PFAggregatedAssetRow extends React.Component<Props, State> {

  state: State = {
    expanded: false,
  };

  _onClick = () => {
    this.setState({expanded: !this.state.expanded});
  };

  render() {
    const expanded = this.state.expanded;
    const symbol = this.props.transactions[0].symbol;
    const curPrice = this.props.marketData[symbol] ? this.props.marketData[symbol].realtime : null;
    const priceIncreased = curPrice !== null && curPrice > this.props.marketData[symbol].lastDayClose;

    let totalQuantity = 0, totalBasis = 0;
    this.props.transactions.forEach((transaction) => {
      totalQuantity += transaction.quantity;
      totalBasis += transaction.basis * transaction.quantity;
    });

    const avgPrice = totalBasis / totalQuantity;

    const totalValue = curPrice === null ? null : (curPrice * totalQuantity);

    const summaryRow = (<div className="pf-row">
      <div className="pf-row-symbol">{symbol}</div>
      <div className='pf-row-price'>
        <div
          className={classNames({'pf-price': true, 'pf-price-green': priceIncreased, 'pf-price-red': !priceIncreased})}>
          {curPrice !== null ? numberWithCommas(curPrice.toFixed(2)) : '...'}</div>
      </div>
      <div className="pf-row-quantity">{numberWithCommas(totalQuantity)}</div>
      <div className="pf-row-basis">{numberWithCommas(avgPrice.toFixed(2))}</div>
      <div
        className="pf-row-current-value">{totalValue === null ? '...' : numberWithCommas(totalValue.toFixed(2))}</div>
      <div
        className={classNames({
            'pf-row-gain': true,
            'pf-color-red': totalValue < totalBasis,
            'pf-color-green': totalValue > totalBasis
          }
        )}>
        {totalValue === null ? '...' : numberWithCommas((totalValue - totalBasis).toFixed(2))}</div>
    </div>);


    return (<div className="pf-item" key={symbol} onClick={this._onClick}>
      {summaryRow}
      {expanded ?
        <div style={{marginTop: '8px'}}>
          {this.props.transactions.map((row, index) => {
              return (<div className="pf-row" key={index}>
                <div className="pf-row-symbol" style={{visibility: 'hidden'}}>{symbol}</div>
                <div className="pf-row-price" style={{visibility: 'hidden'}}>
                  {curPrice !== null ? curPrice.toFixed(2) : '...'}</div>
                <div className="pf-row-quantity">{numberWithCommas(row.quantity)}</div>
                <div className="pf-row-basis">{numberWithCommas(row.basis)}</div>
                <div
                  className="pf-row-current-value">{curPrice ? numberWithCommas((curPrice * row.quantity).toFixed(2)) : '...'}</div>
                <div
                  className={classNames({
                    'pf-row-gain': true,
                    'pf-color-red': curPrice !== null && curPrice < row.basis,
                    'pf-color-green': curPrice !== null && curPrice > row.basis
                  })}
                > {curPrice ? numberWithCommas(((curPrice - row.basis) * row.quantity).toFixed(2)) : '...'}</div>
              </div>);
            }
          )}</div>
        : null}
    </div>);
  }
}