export type PFSymbol = string;

export type PFSymbolToStockDataPoint = { [symbol: string]: StockDataPoint };

export type PFSymbolToMetadata = {[symbol: string]: PFSymbolMetadata};

export type StockDataPoint = {
  latestPrice: number,
  previousClose: number,
};

export type PFSymbolMetadata = {
  companyName: string,
}

export enum PriceDisplayMode {
  ABSOLUTE_CHANGE,
  PERCENT_CHANGE,
}
