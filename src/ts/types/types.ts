import {StockDataPoint} from '../stock-data-fetch';

export type PFSymbol = string;

export type PFSymbolToStockDataPoint = { [symbol: string]: StockDataPoint };
