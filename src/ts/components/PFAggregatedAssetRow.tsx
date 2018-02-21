import React = require('react');
import {PFTradeItem} from '../types/pf-trade-items';
import {PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';
import '../../css/pf-aggregated-row.less';

import classNames = require('classnames');
import {format} from '../util';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFStockPriceTag} from './PFStockPriceTag';

type Props = {
  transactions: PFTradeItem[],
  marketData: PFSymbolToStockDataPoint,
  priceDisplayMode: PriceDisplayMode,
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

  _onRowDeleteClick = (event, symbol, index) => {
    event.stopPropagation();
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DELETE_ROW,
      symbol,
      index,
    })
  };

  _onRowDeleteAllClick = (event, symbol) => {
    event.stopPropagation();
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DELETE_SYMBOL,
      symbol,
    });
  };

  render() {
    // TODO: refactor the following code to use functions in the PFUnsoldAssetStore.
    const expanded = this.state.expanded;
    const symbol = this.props.transactions[0].symbol;
    const symbolData = this.props.marketData[symbol];

    const curPrice = symbolData && symbolData.latestPrice
      || null;

    const lastClose = symbolData && symbolData.previousClose
      || null;
    const symbolDayChange = curPrice !== null && curPrice - lastClose || null;

    let totalQuantity = 0, totalBasis = 0;
    this.props.transactions.forEach((transaction) => {
      totalQuantity += transaction.quantity;
      totalBasis += transaction.basis * transaction.quantity;
    });

    let symbolTotalDayChange = symbolDayChange !== null && symbolDayChange * totalQuantity || null;
    let dayChangeText = '...';
    if (symbolTotalDayChange !== null) {
      dayChangeText = format(symbolTotalDayChange.toFixed(2));
      if (dayChangeText[0] !== '-') {
        dayChangeText = '+' + dayChangeText;
      }
    }

    const avgPrice = totalBasis / totalQuantity;

    const totalValue = curPrice === null ? null : (curPrice * totalQuantity);

    const overallGainPercent = curPrice && (curPrice - avgPrice) / avgPrice * 100 || null;
    let overallGainPercentText = '';
    if (overallGainPercent !== null) {
      overallGainPercentText = overallGainPercent.toFixed(2) + '%';
      if (overallGainPercentText[0] !== '-') {
        overallGainPercentText = '+' + overallGainPercentText;
      }
      overallGainPercentText = '(' + overallGainPercentText + ')';
    }

    const hasDayProfit = curPrice !== null && curPrice - lastClose > 1e-6;
    const hasDayLoss = curPrice !== null && curPrice - lastClose < 1e-6;

    const summaryRow = (<div className="pf-symbol-summary" onClick={this._onClick}>
      <div className="pf-row-symbol">
        <div>{symbol}</div>
        <div className="pf-row-company-name">{symbolData && symbolData.companyName}</div>
      </div>
      <div className='pf-row-price'>
        <PFStockPriceTag price={curPrice} previousClose={lastClose} priceDisplayMode={this.props.priceDisplayMode}/>
      </div>
      <div className="pf-row-avg-buy-price">
        <div>{format(avgPrice.toFixed(2))}</div>
        <div className="pf-row-quantity">({format(totalQuantity)} stocks)</div>
      </div>
      <div
        className={classNames({
            'pf-row-day-change': true,
            'pf-color-red': hasDayLoss,
            'pf-color-green': hasDayProfit
          }
        )}>
        {dayChangeText}
      </div>
      <div
        className={classNames({
            'pf-row-overall-change': true,
            'pf-color-red': curPrice !== null && totalValue < totalBasis,
            'pf-color-green': curPrice !== null && totalValue > totalBasis
          }
        )}>
        {totalValue === null ? '...' : format((totalValue - totalBasis).toFixed(2))} {overallGainPercentText}
      </div>
      <div className="pf-row-actions">
        <a href="#" onClick={(event) => this._onRowDeleteAllClick(event, symbol)}>delete</a>
      </div>
    </div>);


    return (<div className="pf-item" key={symbol}>
      {summaryRow}
      {expanded ?
        <div className="pf-symbol-details">
          {this.props.transactions.map((row, index) => {
              const overallGainText = curPrice ? format(((curPrice - row.basis) * row.quantity).toFixed(2)) : '...';
              let overallGainPercent = curPrice ? ((curPrice - row.basis) / row.basis * 100).toFixed(2) + '%' : '';
              if (overallGainPercent) {
                overallGainPercent = '(' + overallGainPercent + ')';
              }
              return (<div className="pf-symbol-detail-row" key={index}>
                <div className="pf-symbol-detail-buy-price">
                  {format(row.quantity)} stocks @ {format(row.basis.toFixed(2))}
                </div>
                <div className={classNames({
                  'pf-symbol-detail-day-change': true,
                  'pf-color-red': hasDayLoss,
                  'pf-color-green': hasDayProfit
                })}>
                  {symbolDayChange === null
                    ? '...'
                    : format((symbolDayChange * row.quantity).toFixed(2))}</div>
                <div
                  className={classNames({
                    'pf-symbol-detail-overall-gain': true,
                    'pf-color-red': curPrice !== null && curPrice - row.basis < 1e-6,
                    'pf-color-green': curPrice !== null && curPrice - row.basis > 1e-6
                  })}
                > {overallGainText}{' '}{overallGainPercent}</div>
                <div className="pf-row-actions">
                  <a href="#" onClick={(event) => this._onRowDeleteClick(event, symbol, index)}>delete</a>
                </div>
              </div>);
            }
          )}</div>
        : null}
    </div>);
  }
}