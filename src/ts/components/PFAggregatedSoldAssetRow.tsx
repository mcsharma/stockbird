import React = require('react');
import {PFTradeItem} from '../types/pf-trade-items';
import {PFSymbolMetadata} from '../types/types';
import '../../css/pf-aggregated-row.less';

import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {List} from 'immutable';
import {formatFloat, formatInt} from '../util';
import {PFMarketNumber} from './PFMarketNumber';

type Props = {
  transactions: List<PFTradeItem>,
  totalQuantity: number,
  totalValue: number,
  totalBasis: number,
  symbolMetadata: PFSymbolMetadata
}

type State = {
  expanded: boolean;
}

export class PFAggregatedSoldAssetRow extends React.Component<Props, State> {

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
      type: PFActionTypes.SOLD_DELETE_SYMBOL,
      symbol,
    });
  };

  render() {
    // TODO: refactor the following code to use functions in the PFUnsoldAssetStore.
    const expanded = this.state.expanded;
    const symbol = this.props.transactions.get(0).symbol;
    const summaryRow = (<div className="pf-sold-symbol-summary" onClick={this._onClick}>
        <div className="pf-sold-row-symbol">
          <div>{symbol}</div>
          <div className="pf-row-company-name">{this.props.symbolMetadata && this.props.symbolMetadata.companyName}</div>
        </div>
        <div className="pf-sold-row-details">
          <div>Invested {formatFloat(this.props.totalBasis)}</div>
        </div>
        <div className="pf-sold-row-gain"><
          PFMarketNumber current={this.props.totalValue} previous={this.props.totalBasis}/>
        </div>
        <div className="pf-sold-row-actions">
          <a href="#" onClick={(event) => this._onRowDeleteAllClick(event, symbol)}>delete</a>
        </div>
      </div>)
    ;


    return (<div className="pf-item" key={symbol}>
      {summaryRow}
      {expanded ?
        <div className="pf-symbol-details">
        </div>
        : null}
    </div>);
  }
}