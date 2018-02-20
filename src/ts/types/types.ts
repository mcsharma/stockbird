import {StockDataPoint} from '../stock-data-fetch';

export type PFSymbol = string;

export type PFSymbolToStockDataPoint = { [symbol: string]: StockDataPoint };

export enum PriceDisplayMode {
  PER_SHARE_PRICE,
  PERCENT_CHANGE,
}
