import {List, Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import {PFAction} from '../types/PFAction';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbol} from '../types/types';
import {fetchAndUpdateStockData} from '../stock-data-fetch';
import {setCookie} from '../storage/cookies';

class State extends Record({
  symbols: List<PFSymbol>(),
}) {
  symbols: List<PFSymbol>;
}


class PFWatchlistStore extends ReduceStore<State, PFAction> {

  getInitialState() {
    return new State();
  }

  reduce(state: State, action: PFAction): State {
    switch (action.type) {
      case PFActionTypes.COOKIE_DATA_LOADED:
        state = state.set('symbols', action.watchlist) as State;
        return state;
      case PFActionTypes.WATCHLIST_ADD_ITEM:
        state = state.set('symbols', state.symbols.push(action.symbol.toUpperCase())) as State;
        const _ = fetchAndUpdateStockData(state.symbols.toArray());
        setCookie('watchlist', JSON.stringify(state.symbols.toArray()));
        return state;
      default:
        return state;
    }
  }
}

export default new PFWatchlistStore(PFDispatcher);
