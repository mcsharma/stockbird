import {Container} from 'flux/utils';
import React = require('react');
import PFUnsoldAssetsStore from '../stores/PFUnsoldAssetsStore';
import {PFUnsoldStocks} from '../components/PFUnsoldStocks';
import {PFTradeDraftItem, PFTradeItem} from '../types/pf-trade-items';
import MarketDataStore from '../stores/PFMarketDataStore';
import {PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';

type State = {
  assets: PFTradeItem[][],
  draftItem?: PFTradeDraftItem,
  marketData: PFSymbolToStockDataPoint,
  priceDisplayMode: PriceDisplayMode,
};

class PFUnsoldStocksContainer extends React.PureComponent<{}, State> {

  static getStores() {
    return [PFUnsoldAssetsStore, MarketDataStore];
  }

  static calculateState(prevState: State): State {
    const state = PFUnsoldAssetsStore.getState();
    const marketState = MarketDataStore.getState();
    return {
      assets: state.get('assets').toArray().map(item => item.toArray()),
      draftItem: state.get('draftItem'),
      marketData: marketState.marketData,
      priceDisplayMode: state.priceDisplayMode,
    }
  }

  render() {
    return <PFUnsoldStocks {...this.state} />;
  }
}

export default Container.create(PFUnsoldStocksContainer);
