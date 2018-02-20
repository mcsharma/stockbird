import {Container} from 'flux/utils';
import React = require('react');
import PFUnsoldAssetsStore from '../stores/PFUnsoldAssetsStore';
import {PFSummary} from '../components/PFSummary';
import PFMarketDataStore from '../stores/PFMarketDataStore';
import {PFTradeItem} from '../types/pf-trade-items';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';

type State = {
  assets: OrderedMap<PFSymbol, List<PFTradeItem>>,
  marketData: PFSymbolToStockDataPoint,
};

class PFSummaryContainer extends React.PureComponent<{}, State> {

  static getStores() {
    return [PFUnsoldAssetsStore, PFMarketDataStore];
  }

  static calculateState(prevState: State): State {
    const assets = PFUnsoldAssetsStore.getState().get('assets');
    const marketData = PFMarketDataStore.getState().get('marketData');
    return {
      assets,
      marketData,
    };
  }

  render() {
    return <PFSummary {...this.state} />;
  }
}

export default Container.create(PFSummaryContainer);
