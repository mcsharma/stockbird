import React = require('react');
import '../../css/pf-card.less';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbol, PFSymbolToMetadata} from '../types/types';
import {List, OrderedMap} from 'immutable';
import {PFAggregatedSoldAssetRow} from './PFAggregatedSoldAssetRow';

type Props = {
  quantityBySymbol: { [symbol: string]: number },
  basisBySymbol: { [symbol: string]: number },
  valueBySymbol: { [symbol: string]: number },
  transactionsBySymbol: OrderedMap<PFSymbol, List<PFTradeItem>>,
  marketMetadata: PFSymbolToMetadata,
};

type State = {
  draftItem?: PFTradeDraftItem,
};

export class PFSoldStocks extends React.Component<Props, State> {


  state: State = {};

  _onAddClick = () => {
    this.setState({draftItem: new PFTradeDraftItem()})
  };

  _onSaveClick = () => {
    PFDispatcher.dispatch({
      type: PFActionTypes.SOLD_DRAFT_SAVE,
      draftItem: this.state.draftItem,
    });
    this._onDeleteDraft();
  };

  _onDeleteRow = (symbol, index) => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DELETE_ROW,
      symbol,
      index,
    });
  };

  _onQuantityChange = (symbol, index, value) => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_QUANTITY_UPDATE,
      symbol,
      index,
      value,
    });
  };

  _onBasisChange = (symbol, index, value) => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_BASIS_UPDATE,
      symbol,
      index,
      value,
    });
  };

  _onDraftSymbolChange = (value) => {
    this.setState({
      draftItem: this.state.draftItem.set('symbol', value) as PFTradeDraftItem
    });
  };

  _onDraftQuantityChange = (value) => {
    this.setState({
      draftItem: this.state.draftItem.set('quantity', value) as PFTradeDraftItem
    });
  };

  _onDraftBasisChange = (value) => {
    this.setState({
      draftItem: this.state.draftItem.set('basis', value) as PFTradeDraftItem
    });
  };

  _onDraftSellPriceChange = (value) => {
    this.setState({
      draftItem: this.state.draftItem.set('sellPrice', value) as PFTradeDraftItem
    });
  };

  _onDeleteDraft = () => {
    this.setState({draftItem: null});
  };

  render() {
    const header = <div className="pf-table-header">
      <div className="pf-sold-header-symbol">Symbol</div>
      <div className="pf-sold-header-details">Details</div>
      <div className="pf-sold-header-gain">Gain/Loss</div>
      <div className="pf-sold-header-actions">Actions</div>
    </div>;
    const table = <div className="pf-table">
      {Object.keys(this.props.quantityBySymbol).map((symbol) =>
        <PFAggregatedSoldAssetRow
          key={symbol}
          symbolMetadata={this.props.marketMetadata[symbol]}
          transactions={this.props.transactionsBySymbol.get(symbol)}
          totalQuantity={this.props.quantityBySymbol[symbol]}
          totalBasis={this.props.basisBySymbol[symbol]}
          totalValue={this.props.valueBySymbol[symbol]}
        />
      )}</div>;

    let draftItem = null, addButton = null;
    if (this.state.draftItem) {
      draftItem = (<div className="pf-row">
        <input placeholder="symbol" className="pf-row-symbol" value={this.state.draftItem.symbol || ''}
               onChange={(event) => this._onDraftSymbolChange(event.target.value)}/>
        <input placeholder="quantity" className="pf-row-quantity" value={this.state.draftItem.quantity}
               onChange={(event) => this._onDraftQuantityChange(event.target.value)}/>
        <input placeholder="buying price" className="pf-row-basis" value={this.state.draftItem.basis}
               onChange={(event) => this._onDraftBasisChange(event.target.value)}/>
        <input placeholder="sell price" className="pf-row-sell-price" value={this.state.draftItem.sellPrice}
               onChange={(event) => this._onDraftSellPriceChange(event.target.value)}/>
        <button onClick={this._onSaveClick}>Save</button>
        <button onClick={this._onDeleteDraft}>Delete</button>
      </div>);
    } else {
      addButton = <button style={{marginTop: '16px'}} onClick={this._onAddClick}>Add Entry</button>;
    }

    return (<div className="pf-card">
      {header}
      {table}
      {draftItem}
      {addButton}
    </div>);
  }
}
