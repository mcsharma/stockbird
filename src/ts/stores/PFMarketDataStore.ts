import {Record} from 'immutable';
import {ReduceStore} from 'flux/utils';
import {PFAction} from '../types/PFAction';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';
import {PFSymbolToMetadata, PFSymbolToStockDataPoint} from '../types/types';

class State extends Record({
  marketData: {},
  marketMetadata: {},
}) {
  marketData: PFSymbolToStockDataPoint;
  marketMetadata: PFSymbolToMetadata;
}


class PFMarketDataStore extends ReduceStore<State, PFAction> {

  getInitialState() {
    return new State();
  }

  reduce(state: State, action: PFAction): State {
    switch (action.type) {
      case PFActionTypes.MARKET_DATA_UPDATE:
        state = state.set('marketMetadata', action.result.metadata) as State;
        return state.set('marketData', action.result.data) as State;
      default:
        return state;
    }
  }
}

export default new PFMarketDataStore(PFDispatcher);
