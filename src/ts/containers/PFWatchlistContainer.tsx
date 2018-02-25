import {Container} from 'flux/utils';
import React = require('react');
import PFUnsoldAssetsStore from '../stores/PFAssetsStore';
import {PFSummary} from '../components/PFSummary';
import PFMarketDataStore from '../stores/PFMarketDataStore';
import {PFTradeItem} from '../types/pf-trade-items';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import PFWatchlistStore from '../stores/PFWatchlistStore';
import {PFWatchlist} from '../components/PFWatchlist';

type State = {
  marketData: PFSymbolToStockDataPoint,
  symbols: List<PFSymbol>,
};

class PFWatchlistContainer extends React.PureComponent<{}, State> {

  static getStores() {
    return [PFWatchlistStore, PFMarketDataStore];
  }

  static calculateState(prevState: State): State {
    const {marketData} = PFMarketDataStore.getState();
    const {symbols} = PFWatchlistStore.getState();
    return {
      marketData,
      symbols,
    };
  }

  render() {
    return <PFWatchlist {...this.state} />;
  }
}

export default Container.create(PFWatchlistContainer);
