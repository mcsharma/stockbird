import {Record} from 'immutable';

const DEFAULT_VALUES = {
  tid: 0,
  symbol: '',
  buyDate: null,
  basis: 0,
  sellPrice: null,
  sellDate: null,
  quantity: 0,
};

export class PFTradeItem extends Record(DEFAULT_VALUES) {
  tid: number;
  symbol: string;
  basis: number;
  sellPrice: number|null;
  buyDate: Date | null;
  sellDate: Date | null;
  quantity: number;
}


const DEFAULT_DRAFT_VALUES = {
  symbol: '',
  buyDate: '',
  basis: '',
  sellPrice: '',
  sellDate: '',
  quantity: '',
};

export class PFTradeDraftItem extends Record(DEFAULT_DRAFT_VALUES) {
  symbol: string;
  buyDate: string;
  basis: string;
  sellPrice: string;
  sellDate: string;
  quantity: string;

}