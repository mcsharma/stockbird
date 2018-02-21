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
    const expanded = this.state.expanded;
    const symbol = this.props.transactions[0].symbol;
    const symbolData = this.props.marketData[symbol];
    const curPrice = symbolData && symbolData.latestPrice
      || null;
    const lastClose = symbolData && symbolData.previousClose
      || null;
    let totalQuantity = 0, totalBasis = 0;
    this.props.transactions.forEach((transaction) => {
      totalQuantity += transaction.quantity;
      totalBasis += transaction.basis * transaction.quantity;
    });

    const avgPrice = totalBasis / totalQuantity;

    const totalValue = curPrice === null ? null : (curPrice * totalQuantity);

    const summaryRow = (<div className="pf-row">
      <div className="pf-row-symbol">
        <div>{symbol}</div>
        <div className="pf-company-name">{symbolData && symbolData.companyName}</div>
      </div>
      <div className='pf-row-price'>
        <PFStockPriceTag price={curPrice} previousClose={lastClose} priceDisplayMode={this.props.priceDisplayMode}/>
      </div>
      <div className="pf-row-quantity">{format(totalQuantity)}</div>
      <div className="pf-row-basis">{format(avgPrice.toFixed(2))}</div>
      <div
        className="pf-row-current-value">{totalValue === null ? '...' : format(totalValue.toFixed(2))}</div>
      <div
        className={classNames({
            'pf-row-gain': true,
            'pf-color-red': totalValue < totalBasis,
            'pf-color-green': totalValue > totalBasis
          }
        )}>
        {totalValue === null ? '...' : format((totalValue - totalBasis).toFixed(2))}</div>
      <div className="pf-row-actions">
        <a href="#" onClick={(event) => this._onRowDeleteAllClick(event, symbol)}>delete</a>
      </div>
    </div>);


    return (<div className="pf-item" key={symbol} onClick={this._onClick}>
      {summaryRow}
      {expanded ?
        <div style={{marginTop: '8px'}}>
          {this.props.transactions.map((row, index) => {
              return (<div className="pf-row" key={index}>
                <div className="pf-row-symbol" style={{visibility: 'hidden'}}>{symbol}</div>
                <div className="pf-row-price" style={{visibility: 'hidden'}}>
                  {curPrice !== null ? format(curPrice.toFixed(2)) : '...'}</div>
                <div className="pf-row-quantity">{format(row.quantity)}</div>
                <div className="pf-row-basis">{format(row.basis.toFixed(2))}</div>
                <div
                  className="pf-row-current-value">{curPrice ? format((curPrice * row.quantity).toFixed(2)) : '...'}</div>
                <div
                  className={classNames({
                    'pf-row-gain': true,
                    'pf-color-red': curPrice !== null && curPrice < row.basis,
                    'pf-color-green': curPrice !== null && curPrice > row.basis
                  })}
                > {curPrice ? format(((curPrice - row.basis) * row.quantity).toFixed(2)) : '...'}</div>
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