import PFUnsoldAssetsStore from './stores/PFUnsoldAssetsStore';
import {PFDispatcher} from './dispatcher/PFDispatcher';
import PFActionTypes from './types/PFActionTypes';
import {PFSymbolToStockDataPoint} from './types/types';
import {Simulate} from 'react-dom/test-utils';

export type StockDataPoint = {
  latestPrice: number,
  previousClose: number,
  companyName: string,
};

export function recursivelyFetchStockData() {
  const allSymbols = PFUnsoldAssetsStore.getState().get('assets').keySeq().toArray();
  getStockData(allSymbols).then(data => {
    PFDispatcher.dispatch({
      type: PFActionTypes.MARKET_DATA_UPDATE,
      data,
    });
    setTimeout(() => recursivelyFetchStockData(), 3000);
  }, (error) => {
    console.log('API Call failed for symbols: ', allSymbols);
    setTimeout(() => recursivelyFetchStockData(), 3000);
  });
}


function getStockData(symbols: string[]): Promise<PFSymbolToStockDataPoint> {
  if (symbols.length === 0) {
    return Promise.resolve({});
  }
  return new Promise<PFSymbolToStockDataPoint>((resolve, reject) => {
    const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbols.join(',') + '&types=quote';
    httpGetAsync(url, (response) => {
      const responseJson = JSON.parse(response);
      const result = {};
      symbols.forEach((symbol) => {
          const quote = responseJson[symbol].quote;
          const latestPrice = quote.latestPrice as number;
          const previousClose = quote.previousClose as number;
          const companyName = quote.companyName as string;
          result[symbol] = {latestPrice, previousClose, companyName};
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
