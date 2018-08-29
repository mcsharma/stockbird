import React = require('react');
import {PFTradeItem} from '../types/pf-trade-items';
import {PFSymbolToMetadata, PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';
import '../../css/pf-aggregated-row.less';

import classNames = require('classnames');
import {formatFloat, formatInt, getNetAssetPrevCloseValue, getNetAssetValue, getUnsoldCostBasis} from '../util';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFStockPriceTag} from './PFStockPriceTag';
import {PFMarketNumber} from './PFMarketNumber';

type Props = {
  transactions: PFTradeItem[],
  marketData: PFSymbolToStockDataPoint,
  marketMetadata: PFSymbolToMetadata,
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
    });
  };

  _onRowDeleteAllClick = (event, symbol) => {
    event.stopPropagation();
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DELETE_SYMBOL,
      symbol,
    });
  };

  render() {
    // TODO: refactor the following code to use functions in the PFAssetStore.
    const expanded = this.state.expanded;
    const symbol = this.props.transactions[0].symbol;
    const symbolData = this.props.marketData[symbol];
    const symbolMetaData = this.props.marketMetadata[symbol];

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

    const avgPrice = totalBasis / totalQuantity;

    const symbolMarketData = this.props.marketData[this.props.transactions[0].symbol];
    const assetValue = getNetAssetValue(this.props.transactions, symbolMarketData);
    const totalCostBasis = getUnsoldCostBasis(this.props.transactions);

    const summaryRow = (<div className="pf-unsold-symbol-summary" onClick={this._onClick}>
      <div className="pf-row-symbol">
        <div>{symbol}</div>
        <div className="pf-row-company-name">{symbolMetaData && symbolMetaData.companyName}</div>
      </div>
      <div className='pf-row-price'>
        <div className="pf-row-price-absolute">
          <PFMarketNumber current={curPrice} previous={lastClose}
                          showCurrentValue={true} showPercent={false}/>
        </div>
        <div className="pf-row-price-tag">
          <PFStockPriceTag price={curPrice} previousClose={lastClose}
                           priceDisplayMode={this.props.priceDisplayMode}/>
        </div>
      </div>
      <div className="pf-row-avg-buy-price">
        <div>{formatFloat(avgPrice)}</div>
        <div className="pf-row-quantity">({formatInt(totalQuantity)} stocks)</div>
      </div>
      <div
        className={'pf-row-day-change'}>
        <PFMarketNumber current={symbolTotalDayChange} previous={0} showPercent={false}/>
      </div>
      <div className="pf-row-symbol-overall-gain">
        <PFMarketNumber current={assetValue} previous={totalCostBasis}/>
      </div>
      <div className="pf-row-actions">
        <a href="#" onClick={(event) => this._onRowDeleteAllClick(event, symbol)}>delete</a>
      </div>
    </div>);

    return (<div className="pf-item" key={symbol}>
      {summaryRow}
      {expanded ?
        <div className="pf-symbol-details">
          <div className="pf-symbol-details-header">
            <div className="pf-symbol-details-header-buy">Buy</div>
            <div className="pf-symbol-details-header-gain">Gain/Loss</div>
          </div>
          {this.props.transactions.map((row, index) => {
              const currentVal = curPrice ? curPrice * row.quantity : null;
              const previousVal = curPrice ? row.basis * row.quantity : null;
              return (<div className="pf-symbol-detail-row" key={index}>
                <div className="pf-symbol-detail-buy-price">
                  {formatInt(row.quantity)} stocks @ {formatFloat(row.basis)}
                </div>
                <div className="pf-symbol-detail-overall-gain">
                  <PFMarketNumber current={currentVal} previous={previousVal} showPercent={false}/>
                </div>
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