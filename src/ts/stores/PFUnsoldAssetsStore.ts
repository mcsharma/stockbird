import {List, OrderedMap, Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import {PFAction} from '../types/PFAction';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbol} from '../types/types';
import {setCookie} from '../storage/cookies';

const DEFAULT_STATE = {
  assets: OrderedMap<string, PFTradeItem>(),
  draftItem: null,
};

class State extends Record(DEFAULT_STATE) {
  assets: OrderedMap<PFSymbol, PFTradeItem>;
  draftItem?: PFTradeDraftItem | null;
}

class PFAssetsStore extends ReduceStore<State, PFAction> {

  getInitialState() {
    return new State();
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
        const draftItem = state.get('draftItem') as PFTradeDraftItem;
        const symbol = draftItem.symbol;
        if (!symbol ||
          !symbol.match(/^[A-Z]+$/) ||
          !draftItem.quantity ||
          !draftItem.quantity.match(/^\d+$/) ||
          isNaN(+draftItem.basis)) {
          return state;
        }
        if (!assets.get(symbol)) {
          assets = assets.set(symbol, List.of(draftItem));
        } else {
          assets = assets.set(symbol, assets.get(symbol).push(draftItem));
        }
        assets = assets.delete('');
        assets = assets.delete('MSFT');
        state = state.set('assets', assets) as State;
        state = state.set('draftItem', null) as State;
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
        return state.set('assets', assets) as State;
      default:
        return state;
    }
  }
}

export default new PFAssetsStore(PFDispatcher);
