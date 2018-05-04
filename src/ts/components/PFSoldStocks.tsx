import React = require('react');
import '../../css/pf-card.less';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbol, PFSymbolToMetadata} from '../types/types';
import {List, OrderedMap} from 'immutable';
import {PFAggregatedSoldAssetRow} from './PFAggregatedSoldAssetRow';
import {PFButton} from './PFButton';
import {PFInput} from './PFInput';
import {PFText} from './PFText';

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

    let footer = null;
    if (this.state.draftItem) {
      footer = (
        <div>
          <PFText weight={'bold'} size={14} color={'heading'}>Add Transaction</PFText>
          <div className={'pf-sold-draft-row'}>
            <div className={'pf-sold-draft-row-inputs'}>
              <PFInput placeholder="symbol" value={this.state.draftItem.symbol || ''}
                       onChange={(value) => this._onDraftSymbolChange(value)}/>
              <PFInput placeholder="quantity" value={this.state.draftItem.quantity}
                       onChange={(value) => this._onDraftQuantityChange(value)}/>
              <PFInput placeholder="buying price" value={this.state.draftItem.basis}
                       onChange={(value) => this._onDraftBasisChange(value)}/>
              <PFInput placeholder="sell price" value={this.state.draftItem.sellPrice}
                       onChange={(value) => this._onDraftSellPriceChange(value)}/>
            </div>
            <div><PFButton type="primary" onClick={this._onSaveClick} label={'Save'}/>
              <PFButton onClick={this._onDeleteDraft} label={'Delete'}/>
            </div>
          </div>
        </div>);
    } else {
      footer = <PFButton type="primary" onClick={this._onAddClick} label={'Add Entry'}/>;
    }

    return (<div className="pf-card">
      {header}
      {table}
      <div className="margin-top-20">{footer}</div>
    </div>);
  }
}
