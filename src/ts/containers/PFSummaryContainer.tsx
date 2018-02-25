import {Container} from 'flux/utils';
import React = require('react');
import PFUnsoldAssetsStore from '../stores/PFAssetsStore';
import {PFSummary} from '../components/PFSummary';
import PFMarketDataStore from '../stores/PFMarketDataStore';
import {PFTradeItem} from '../types/pf-trade-items';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';

type State = {
  marketData: PFSymbolToStockDataPoint,
  marketFundCostBasis: number,
  marketFundValue: number | null,
  marketFundPreviousCloseValue: number | null,
  soldFundCostBasis: number,
  soldFundValue: number,
};

class PFSummaryContainer extends React.PureComponent<{}, State> {

  static getStores() {
    return [PFUnsoldAssetsStore, PFMarketDataStore];
  }

  static calculateState(prevState: State): State {
    const {marketData} = PFMarketDataStore.getState();
    const {marketFundPreviousCloseValue, marketFundValue, marketFundCostBasis} = PFUnsoldAssetsStore.getDetailsForUnsoldSymbols();
    const {soldFundCostBasis, soldFundValue} = PFUnsoldAssetsStore.getSummaryForSoldSymbols();

    return {
      marketData,
      marketFundCostBasis,
      marketFundValue,
      marketFundPreviousCloseValue,
      soldFundCostBasis,
      soldFundValue,
    };
  }

  render() {
    return <PFSummary {...this.state} />;
  }
}

export default Container.create(PFSummaryContainer);
