import PFAssetsStore from './stores/PFAssetsStore';
import {PFDispatcher} from './dispatcher/PFDispatcher';
import PFActionTypes from './types/PFActionTypes';
import {PFSymbolToMetadata, PFSymbolToStockDataPoint} from './types/types';
import {Set} from 'immutable';
import PFWatchlistStore from './stores/PFWatchlistStore';

export function fetchAndUpdateStockData(symbols: string[] = []) {
  const assets = PFAssetsStore.getState().get('assets');
  const allSymbols = Set.fromKeys(assets)
    .concat(PFWatchlistStore.getState().symbols)
    .concat(symbols)
    .toArray();
  console.log(symbols);
  return fetchStockData(allSymbols as string[]).then(result => {
    PFDispatcher.dispatch({
      type: PFActionTypes.MARKET_DATA_UPDATE,
      result,
    });
  });
}

export function recursivelyFetchAndUpdateStockData() {
  fetchAndUpdateStockData().then(() => {
    setTimeout(() => recursivelyFetchAndUpdateStockData(), 5000);
  }, () => {
    setTimeout(() => recursivelyFetchAndUpdateStockData(), 5000);
  });
}

export type StockFetchResult = { data: PFSymbolToStockDataPoint, metadata: PFSymbolToMetadata };

function fetchStockData(symbols: string[]): Promise<StockFetchResult> {
  const result = {data: {}, metadata: {}};
  if (symbols.length === 0) {
    return Promise.resolve(result);
  }
  // return Promise.resolve({
  //   data: {
  //     FB: {
  //       latestPrice: 172.34,
  //       previousClose: 174.03,
  //     },
  //     GOOG: {
  //       latestPrice: 1023.56,
  //       previousClose: 1024.20,
  //     },
  //     AMZN: {
  //       latestPrice: 1582,
  //       previousClose: 1573,
  //     },
  //     AAPL: {
  //       latestPrice: 172.34,
  //       previousClose: 171,
  //     },
  //     NFLX: {
  //       latestPrice: 313,
  //       previousClose: 311,
  //     },
  //   },
  //   metadata: {
  //     FB: {
  //       companyName: 'Facebook Inc.'
  //     },
  //     GOOG: {
  //       companyName: 'Alphabet Inc.'
  //     },
  //     AMZN: {
  //       companyName: 'Amazon Inc.'
  //     },
  //     AAPL: {
  //       companyName: 'Apple Inc.'
  //     },
  //     NFLX: {
  //       companyName: 'Netflix Inc.'
  //     }
  //   }
  // });
  return new Promise<StockFetchResult>((resolve, reject) => {
    const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbols.join(',') + '&types=quote';
    httpGetAsync(url, (response) => {
      const responseJson = JSON.parse(response);
      symbols.forEach((symbol) => {
          const quote = responseJson[symbol].quote;
          const latestPrice = quote.latestPrice as number;
          const previousClose = quote.previousClose as number;
          const companyName = quote.companyName as string;
          result.data[symbol] = {latestPrice, previousClose};
          result.metadata[symbol] = {companyName};
        }
      );
      resolve(result);
    }, () => {
      reject();
    });
  });
}


function httpGetAsync(theUrl, successCallback, errorCallback = null) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        successCallback(xmlHttp.responseText);
      } else {
        errorCallback && errorCallback();
      }
    }
  };
  xmlHttp.open('GET', theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
