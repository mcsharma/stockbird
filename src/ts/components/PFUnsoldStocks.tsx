import React = require('react');
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbolToMetadata, PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';
import {PFAggregatedAssetRow} from './PFAggregatedAssetRow';
import {PFButton} from './PFButton';
import {PFInput} from './PFInput';
import {PFText} from './PFText';

type Props = {
  assets: PFTradeItem[][];
  draftItem?: PFTradeDraftItem;
  marketData: PFSymbolToStockDataPoint;
  marketMetadata: PFSymbolToMetadata;
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
      <div className="pf-header-day-change">Day Change</div>
      <div className="pf-header-avg-buy-price">Avg Buy Price</div>
      <div className="pf-header-overall-change">Current Value</div>
      <div className="pf-header-actions">Actions</div>
    </div>;
    const table = <div className="pf-table">
      {this.props.assets.map((assetRows) => {
        if (assetRows.length === 0) {
          return null;
        }
        const unsoldTransactions = assetRows.filter(row => row.sellPrice === null);
        if (unsoldTransactions.length === 0) {
          return null;
        }
        return (
          <PFAggregatedAssetRow
            key={assetRows[0].symbol}
            transactions={unsoldTransactions}
            marketData={this.props.marketData}
            marketMetadata={this.props.marketMetadata}
            priceDisplayMode={this.props.priceDisplayMode}
          />
        );
      })}</div>;

    let footer = null;
    if (this.props.draftItem) {
      footer = (
        <div>
          <PFText weight={'bold'} size={14} color={'heading'}>Add Transaction</PFText>
          <div className={'pf-row pf-unsold-draft-row'}>
            <div className={'pf-unsold-draft-row-inputs'}>
              <PFInput placeholder={'symbol'} value={this.props.draftItem.symbol} onChange={this._onDraftSymbolChange}/>
              <PFInput placeholder={'quantity'} value={this.props.draftItem.quantity}
                       onChange={this._onDraftQuantityChange}/>
              <PFInput placeholder={'buying price'} value={this.props.draftItem.basis}
                       onChange={this._onDraftBasisChange}/>
            </div>
            <div style={{display: 'flex'}}>
              <PFButton type="primary" onClick={this._onSaveClick} label={'Save'}></PFButton>
              <div className={'margin-left-8'}><PFButton onClick={this._onDeleteDraft} label={'Discard'}></PFButton>
              </div>
            </div>
          </div>
        </div>);
    } else {
      footer = <PFButton type="primary" onClick={this._onAddClick} label={'Add Transaction'}></PFButton>;
    }

    return (<div className="pf-card">
      {header}
      {table}
      <div className="margin-top-20">{footer}</div>
    </div>);
  }
}
