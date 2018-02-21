import React = require('react');
import '../../css/pf-unsold-card.less';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';
import {PFAggregatedAssetRow} from './PFAggregatedAssetRow';

type Props = {
  assets: PFTradeItem[][];
  draftItem?: PFTradeDraftItem;
  marketData: PFSymbolToStockDataPoint;
  priceDisplayMode: PriceDisplayMode,
};

export class PFUnsoldStocks extends React.Component<Props> {


  _onAddClick = () => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_ADD_NEW_ITEM,
    });
  };

  _onSaveClick = () => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DRAFT_SAVE,
    });
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
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DRAFT_SYMBOL_UPDATE,
      value,
    });
  };

  _onDraftQuantityChange = (value) => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DRAFT_QUANTITY_UPDATE,
      value,
    });
  };

  _onDraftBasisChange = (value) => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DRAFT_BASIS_UPDATE,
      value,
    });
  };

  _onDeleteDraft = () => {
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_DRAFT_DELETE,
    });
  };

  render() {
    const header = <div className="pf-table-header">
      <div className="pf-header-symbol">Symbol</div>
      <div className="pf-header-price">Current Price</div>
      <div className="pf-header-avg-buy-price">Avg Buy Price</div>
      <div className="pf-header-day-change">Day Change</div>
      <div className="pf-header-overall-change">Overall G/L</div>
      <div className="pf-header-actions">Actions</div>
    </div>;
    const table = <div className="pf-table">
      {this.props.assets.map((assetRows) => {
        if (assetRows.length === 0) {
          return null;
        }
        return (
          <PFAggregatedAssetRow
            key={assetRows[0].symbol}
            transactions={assetRows}
            marketData={this.props.marketData}
            priceDisplayMode={this.props.priceDisplayMode}
          />
        );
      })}</div>;

    let draftItem = null, addButton = null;
    if (this.props.draftItem) {
      draftItem = (<div className="pf-row">
        <input placeholder="symbol" className="pf-row-symbol" value={this.props.draftItem.symbol || ''}
               onChange={(event) => this._onDraftSymbolChange(event.target.value)}/>
        <input placeholder="quantity" className="pf-row-quantity" value={this.props.draftItem.quantity}
               onChange={(event) => this._onDraftQuantityChange(event.target.value)}/>
        <input placeholder="buying price" className="pf-row-basis" value={this.props.draftItem.basis}
               onChange={(event) => this._onDraftBasisChange(event.target.value)}/>
        <button onClick={this._onSaveClick}>Save</button>
        <button onClick={this._onDeleteDraft}>Delete</button>
      </div>);
    } else {
      addButton = <button style={{marginTop: '16px'}} onClick={this._onAddClick}>Add Entry</button>;
    }

    return (<div className="pf-unsold-card">
      {header}
      {table}
      {draftItem}
      {addButton}
    </div>);
  }
}
