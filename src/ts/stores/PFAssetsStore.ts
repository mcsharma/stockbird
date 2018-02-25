import {List, OrderedMap, Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFAction} from '../types/PFAction';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbol, PriceDisplayMode} from '../types/types';
import {setCookie} from '../storage/cookies';
import {fetchAndUpdateStockData} from '../stock-data-fetch';
import PFMarketDataStore from './PFMarketDataStore';

const DEFAULT_STATE = {
  assets: OrderedMap<string, List<PFTradeItem>>(),
  draftItem: null,
  priceDisplayMode: PriceDisplayMode.PERCENT_CHANGE,
};

class State extends Record(DEFAULT_STATE) {
  assets: OrderedMap<PFSymbol, List<PFTradeItem>>;
  draftItem?: PFTradeDraftItem | null;
  priceDisplayMode: PriceDisplayMode;
}

class PFAssetsStore extends ReduceStore<State, PFAction> {

  getInitialState() {
    return new State();
  }

  /**
   * Gets the aggregated data for a given set of symbols, if symbols is an empty array, returns
   * data for all the symbols.
   * @param {Array<PFSymbol>} symbols
   * @returns {{totalValue: number; totalBasis: number; quantityBySymbol: Object; dayChange: number}}
   */
  getDetailsForUnsoldSymbols(symbols: Array<PFSymbol> = []) {
    let marketFundCostBasis = 0;
    let marketFundValue = 0;
    let marketFundPreviousCloseValue = 0;
    let quantityBySymbol = {};
    let isFetching = false;
    const {marketData} = PFMarketDataStore.getState();
    this.getState().assets.forEach((rows, symbol) => {
      if (symbols.length > 0 && symbols.indexOf(symbol) === -1) {
        // a symbols for which caller don't want data.
        return;
      }
      rows.forEach((row) => {
        if (row.sellPrice !== null) {
          return;
        }
        marketFundCostBasis += row.quantity * row.basis;
        quantityBySymbol[row.symbol] = quantityBySymbol[row.symbol] || 0;
        quantityBySymbol[row.symbol] += row.quantity;

        if (isFetching) {
          return;
        }
        const symbolData = marketData[row.symbol];
        if (!symbolData) {
          isFetching = true;
          return;
        }

        marketFundValue += row.quantity * symbolData.latestPrice;
        marketFundPreviousCloseValue += row.quantity * symbolData.previousClose;
      });
    });

    return {
      marketFundCostBasis,
      quantityBySymbol,
      marketFundValue: isFetching ? null : marketFundValue,
      marketFundPreviousCloseValue: isFetching ? null : marketFundPreviousCloseValue,
    };
  }

  getDetailsForSoldSymbols(symbols: Array<PFSymbol> = []) {
    let quantityBySymbol = {};
    let valueBySymbol = {};
    let basisBySymbol = {};
    let isFetching = false;
    this.getState().assets.forEach((rows, symbol) => {
      if (symbols.length > 0 && symbols.indexOf(symbol) === -1) {
        // a symbols for which caller don't want data.
        return;
      }
      rows.forEach((row) => {
        if (row.sellPrice === null) {
          return;
        }
        quantityBySymbol[row.symbol] = quantityBySymbol[row.symbol] || 0;
        quantityBySymbol[row.symbol] += row.quantity;

        valueBySymbol[row.symbol] = valueBySymbol[row.symbol] || 0;
        valueBySymbol[row.symbol] += row.quantity * row.sellPrice;

        basisBySymbol[row.symbol] = basisBySymbol[row.symbol] || 0;
        basisBySymbol[row.symbol] += row.quantity * row.basis;
      });
    });

    return {
      quantityBySymbol,
      basisBySymbol,
      valueBySymbol,
    };
  }

  getSummaryForSoldSymbols() {
    const details = this.getDetailsForSoldSymbols();
    let soldFundValue = 0,
      soldFundCostBasis = 0;
    Object.keys(details.basisBySymbol).forEach((symbol) => {
      soldFundCostBasis += details.basisBySymbol[symbol];
      soldFundValue += details.valueBySymbol[symbol];
    });
    return {
      soldFundValue,
      soldFundCostBasis,
    }
  }

  reduce(state: State, action: PFAction): State {
    let assets = state.get('assets');
    switch (action.type) {
      case PFActionTypes.COOKIE_DATA_LOADED:
        state = state.set('assets', action.assets) as State;
        return state;
      case PFActionTypes.UNSOLD_ADD_NEW_ITEM:
        state = state.set('draftItem', new PFTradeDraftItem()) as State;
        return state;
      case PFActionTypes.UNSOLD_DRAFT_SYMBOL_UPDATE:
        state = state.set('draftItem', state.get('draftItem').set('symbol', action.value)) as State;
        return state;
      case PFActionTypes.UNSOLD_DRAFT_QUANTITY_UPDATE:
        state = state.set('draftItem', state.get('draftItem').set('quantity', action.value)) as State;
        return state;
      case PFActionTypes.UNSOLD_DRAFT_BASIS_UPDATE:
        state = state.set('draftItem', state.get('draftItem').set('basis', action.value)) as State;
        return state;
      case PFActionTypes.UNSOLD_DRAFT_DELETE:
        return state.set('draftItem', null) as State;
      case PFActionTypes.UNSOLD_DRAFT_SAVE:
      case PFActionTypes.SOLD_DRAFT_SAVE:
        let draftItem = (action.draftItem ? action.draftItem : state.get('draftItem')) as PFTradeDraftItem;
        const symbol = draftItem.symbol;
        if (!symbol ||
          !symbol.match(/^[A-Z]+$/) ||
          !draftItem.quantity ||
          !draftItem.quantity.match(/^\d+$/) ||
          isNaN(+draftItem.basis)) {
          return state;
        }
        const transactions = assets.get(symbol);
        const tid = !transactions || transactions.size === 0 ? 0
          : transactions.maxBy(t => t.tid).tid + 1;
        const realItem = new PFTradeItem({
          tid,
          symbol: draftItem.symbol,
          quantity: +draftItem.quantity,
          basis: +draftItem.basis,
          sellPrice: draftItem.sellPrice && (+draftItem.sellPrice) || null,
        });
        if (!assets.get(symbol)) {
          assets = assets.set(symbol, List.of(realItem));
        } else {
          assets = assets.set(symbol, assets.get(symbol).push(realItem));
        }
        state = state.set('assets', assets) as State;
        state = state.set('draftItem', null) as State;
        const _ = fetchAndUpdateStockData(state.assets.keySeq().toArray());
        setCookie('assets', JSON.stringify(state.assets));
        return state;
      case PFActionTypes.UNSOLD_DELETE_ROW:
        assets = state.get('assets');
        let items = assets.get(action.symbol);
        items = items.deleteIn([action.index]);
        if (items.size === 0) {
          assets = assets.delete(action.symbol);
        } else {
          assets = assets.set(action.symbol, items);
        }
        state = state.set('assets', assets) as State;
        setCookie('assets', JSON.stringify(state.assets));
        return state;
      case PFActionTypes.UNSOLD_DELETE_SYMBOL:
        assets = assets.delete(action.symbol);
        state = state.set('assets', assets) as State;
        setCookie('assets', JSON.stringify(state.assets));
        return state;
      case PFActionTypes.UNSOLD_PRICE_DISPLAY_MODE_CHANGE:
        state = state.set('priceDisplayMode', (state.priceDisplayMode + 1) % 2) as State;
        return state;

      // ******************************* SOLD Actions *******************************************
      case PFActionTypes.SOLD_DELETE_SYMBOL:
        items = assets.get(action.symbol);
        items = items.filter(item => item.sellPrice === null);
        if (items.size === 0) {
          assets = assets.delete(action.symbol);
        } else {
          assets = assets.set(action.symbol, items);
        }
        state = state.set('assets', assets) as State;
        setCookie('assets', JSON.stringify(state.assets));
        return state;
      default:
        return state;
    }
  }
}

export default new PFAssetsStore(PFDispatcher);
