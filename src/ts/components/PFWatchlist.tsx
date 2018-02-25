import React = require('react');
import '../../css/pf-summary.less';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import {List} from 'immutable';
import {PFMarketNumber} from './PFMarketNumber';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';

type Props = {
  marketData: PFSymbolToStockDataPoint,
  symbols: List<PFSymbol>,
};

type State = {
  draft: string | null,
};

export class PFWatchlist extends React.Component<Props, State> {
  state: State = {
    draft: null,
  };

  _onAddClick = () => {
    this.setState({draft: ''});
  };

  _onSaveClick = () => {
    if (this.state.draft.match(/^[A-Za-z]+$/)) {
      PFDispatcher.dispatch({
        type: PFActionTypes.WATCHLIST_ADD_ITEM,
        symbol: this.state.draft,
      });
      this.setState({draft: null});
    }
  };

  _onDeleteDraft = () => {
    this.setState({draft: null});
  };

  render() {
    return (
      <div className="pf-card pf-watchlist">
        <div className="pf-table-header">
          <div>Symbol</div>
          <div>Price</div>
        </div>
        <div className="pf-watchlist-rows">
          {this.props.symbols.map((symbol) => {
            const dataForSymbol = this.props.marketData[symbol];
            const curPrice = dataForSymbol && dataForSymbol.latestPrice || null;
            const lastPrice = dataForSymbol && dataForSymbol.previousClose || null;
            return (
              <div className="pf-watchlist-row" key={symbol}>
                <div>{symbol}</div>
                <PFMarketNumber current={curPrice} previous={lastPrice} showCurrentValue={true}/>
              </div>
            );
          })}
        </div>
        {this.state.draft === null ?
          <button style={{marginTop: '16px'}} onClick={this._onAddClick}>Add Entry</button> :
          <div className="pf-watchlist-input-row">
            <input placeholder="symbol" className="pf-watchlist-symbol-input" value={this.state.draft || ''}
                   onChange={(event) => this.setState({draft: event.target.value})}/>
            <button onClick={this._onSaveClick}>Save</button>
            <button onClick={this._onDeleteDraft}>Delete</button>
          </div>
        }
      </div>
    );
  }
}
