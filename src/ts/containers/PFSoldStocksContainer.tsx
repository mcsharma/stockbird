import {Container} from 'flux/utils';
import React = require('react');
import PFAssetsStore from '../stores/PFAssetsStore';
import {PFTradeItem} from '../types/pf-trade-items';
import MarketDataStore, {default as PFMarketDataStore} from '../stores/PFMarketDataStore';
import {PFSoldStocks} from '../components/PFSoldStocks';
import {PFSymbol, PFSymbolToMetadata} from '../types/types';
import {List, OrderedMap} from 'immutable';

type State = {
  quantityBySymbol: {[symbol: string]: number},
  basisBySymbol: {[symbol: string]: number},
  valueBySymbol: {[symbol: string]: number},
  transactionsBySymbol: OrderedMap<PFSymbol, List<PFTradeItem>>,
  marketMetadata: PFSymbolToMetadata,
};

class PFSoldStocksContainer extends React.PureComponent<{}, State> {

  static getStores() {
    return [PFAssetsStore, MarketDataStore];
  }

  static calculateState(prevState: State): State {
    const state = PFAssetsStore.getState();
    const details = PFAssetsStore.getDetailsForSoldSymbols();
    const {marketMetadata} = PFMarketDataStore.getState();
    return {
      ...details,
      marketMetadata,
      transactionsBySymbol: state.assets.map((rows) => {
        return rows.filter(row => row.sellPrice !== null);
      }) as OrderedMap<PFSymbol, List<PFTradeItem>>,
    };
  }

  render() {
    return <PFSoldStocks {...this.state} />;
  }
}

export default Container.create(PFSoldStocksContainer);
