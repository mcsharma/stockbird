import PFUnsoldAssetsStore from './stores/PFUnsoldAssetsStore';
import {PFDispatcher} from './dispatcher/PFDispatcher';
import PFActionTypes from './types/PFActionTypes';
import {PFSymbolToStockDataPoint} from './types/types';

export type StockDataPoint = {
  realtime: number,
  lastDayClose: number,
};

export function recursivelyFetchStockData() {
  const allSymbols = PFUnsoldAssetsStore.getState().get('assets').keySeq().toArray();
  getStockData(allSymbols).then(data => {
    PFDispatcher.dispatch({
      type: PFActionTypes.MARKET_DATA_UPDATE,
      data,
    });
    setTimeout(() => recursivelyFetchStockData(), 10000);
  }, (error) => {
    setTimeout(() => recursivelyFetchStockData(), 10000);
  });
}


async function getStockData(symbols: string[]): Promise<PFSymbolToStockDataPoint> {
  const dataPoints = await Promise.all(symbols.map((symbol) => {
    return new Promise<StockDataPoint>((resolve, reject) => {
      httpGetAsync('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&interval=1min&apikey=F1BJHA9S1TJZNY08', (response) => {
        const res = JSON.parse(response);
        const time = res['Meta Data']['3. Last Refreshed'];
        const points = res['Time Series (Daily)'];
        const daystamps = Object.keys(points);
        const realtime = parseFloat(points[daystamps[0]]['4. close']);
        const lastDayClose = parseFloat(points[daystamps[1]]['4. close']);
        resolve({realtime, lastDayClose});
      });
    });
  }));

  const result = {};
  symbols.forEach((symbol, index) => {
    result[symbol] = dataPoints[index];
  });
  return result;
}


function httpGetAsync(theUrl, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open('GET', theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
