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
  assets: OrderedMap<string, PFTradeItem>(),
  draftItem: null,
  priceDisplayMode: PriceDisplayMode.PERCENT_CHANGE,
};

class State extends Record(DEFAULT_STATE) {
  assets: OrderedMap<PFSymbol, PFTradeItem>;
  draftItem?: PFTradeDraftItem | null;
  priceDisplayMode: PriceDisplayMode;
}

class PFUnsoldAssetsStore extends ReduceStore<State, PFAction> {

  getInitialState() {
    return new State();
  }

  /**
   * Gets the aggregated data for a given set of symbols, if symbols is an empty array, returns
   * data for all the symbols.
   * @param {Array<PFSymbol>} symbols
   * @returns {{totalValue: number; totalBasis: number; dayChange: number}}
   */
  getTotalValueAndBasisAndDayChange(symbols: Array<PFSymbol> = []) {
    let totalBasis = 0;
    let totalValue = 0;
    let dayChange = 0;
    let isFetching = false;
    const {marketData} = PFMarketDataStore.getState();
    this.getState().assets.forEach((rows, symbol) => {
      if (symbols.length > 0 && symbols.indexOf(symbol) === -1) {
        // a symbols for which caller don't want data.
        return;
      }
      rows.forEach((row) => {
        totalBasis += row.quantity * row.basis;

        if (isFetching) {
          return;
        }
        const symbolData = marketData[row.symbol];
        if (!symbolData) {
          isFetching = true;
          return;
        }

        totalValue += row.quantity * symbolData.latestPrice;
        dayChange += row.quantity * (symbolData.latestPrice - symbolData.previousClose);
      })
    });

    return {
      dayChange: isFetching ? null : dayChange,
      totalBasis: totalBasis,
      totalValue: isFetching ? null : totalValue,
    };
  }

  getTotalCostBasis(): number {
    return this.getTotalValueAndBasisAndDayChange().totalBasis;
  }

  getTotalValue(): number | null {
    return this.getTotalValueAndBasisAndDayChange().totalValue;
  }

  getDayChange(): number | null {
    return this.getTotalValueAndBasisAndDayChange().dayChange;
  }

  getDayChangeForSymbol(symbol: PFSymbol): number | null {
    return this.getTotalValueAndBasisAndDayChange([symbol]).dayChange;
  }

  getDayChangePercent(): number | null {
    const data = this.getTotalValueAndBasisAndDayChange();
    if (data.dayChange === null || data.totalValue === null) {
      return null;
    }
    const previousDayValue = data.totalValue - data.dayChange;
    if (Math.abs(previousDayValue) < 1e-6) {
      return null;
    }
    return (data.dayChange / previousDayValue) * 100;
  }

  getDayChangePercentForSymbol(symbol: PFSymbol): number | null {
    const data = this.getTotalValueAndBasisAndDayChange([symbol]);
    if (data.dayChange === null) {
      return null;
    }
    const previousDayValue = data.totalValue - data.dayChange;
    return (data.dayChange / previousDayValue) * 100;
  }

  getOverallGain(): number | null {
    const data = this.getTotalValueAndBasisAndDayChange();
    if (data.totalValue === null) {
      return null;
    }
    return data.totalValue - data.totalBasis;
  }

  getOverallGainForSymbol(symbol: PFSymbol): number | null {
    const data = this.getTotalValueAndBasisAndDayChange([symbol]);
    if (data.totalValue === null) {
      return null;
    }
    return data.totalValue - data.totalBasis;
  }

  getOverallGainPercent(): number | null {
    const data = this.getTotalValueAndBasisAndDayChange();
    if (data.totalValue === null) {
      return null;
    }
    if (Math.abs(data.totalBasis) < 1e-6) {
      return null;
    }
    return (data.totalValue - data.totalBasis) / data.totalBasis * 100;
  }

  getOverallGainPercentForSymbol(symbol: PFSymbol): number | null {
    const data = this.getTotalValueAndBasisAndDayChange([symbol]);
    if (data.totalValue === null) {
      return null;
    }
    if (Math.abs(data.totalBasis) < 1e-6) {
      return null;
    }
    return (data.totalValue - data.totalBasis) / data.totalBasis * 100;
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
        let draftItem = state.get('draftItem') as PFTradeDraftItem;
        const symbol = draftItem.symbol;
        if (!symbol ||
          !symbol.match(/^[A-Z]+$/) ||
          !draftItem.quantity ||
          !draftItem.quantity.match(/^\d+$/) ||
          isNaN(+draftItem.basis)) {
          return state;
        }
        const realItem = new PFTradeItem({
          symbol: draftItem.symbol,
          quantity: +draftItem.quantity,
          basis: +draftItem.basis,
        });
        if (!assets.get(symbol)) {
          assets = assets.set(symbol, List.of(realItem));
        } else {
          assets = assets.set(symbol, assets.get(symbol).push(realItem));
        }
        state = state.set('assets', assets) as State;
        state = state.set('draftItem', null) as State;
        const _ = fetchAndUpdateStockData();
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
      default:
        return state;
    }
  }
}

export default new PFUnsoldAssetsStore(PFDispatcher);
