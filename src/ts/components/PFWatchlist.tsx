import React = require('react');
import '../../css/pf-summary.less';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import {List} from 'immutable';
import {PFMarketNumber} from './PFMarketNumber';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFInput} from './PFInput';
import {PFButton} from './PFButton';

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
        <div style={{marginTop: 12}}>{this.state.draft === null ?
          <PFButton size="small" type="primary" onClick={this._onAddClick} label={'Add Entry'}/> :
          <div className="pf-watchlist-input-row">
            <PFInput size="small" placeholder="Symbol" width={60} value={this.state.draft || ''}
                     onChange={(value) => this.setState({draft: value})}/>
            <div>
              <PFButton type="primary" size="small" onClick={this._onSaveClick} label={'Save'}></PFButton>
              <PFButton size="small" onClick={this._onDeleteDraft} label={'Cancel'}></PFButton>
            </div>
          </div>
        }</div>
      </div>
    );
  }
}
