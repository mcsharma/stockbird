import '../css/app.less';
import ReactDOM = require('react-dom');
import * as React from 'react';
import {PFRoot} from './components/PFRoot';
import {getCookie} from './storage/cookies';
import {List, OrderedMap, Record} from 'immutable';
import {PFTradeItem} from './types/pf-trade-items';
import {PFDispatcher} from './dispatcher/PFDispatcher';
import PFActionTypes from './types/PFActionTypes';

const mutableAssets = JSON.parse(getCookie('assets') || '{}');
const mutableWatchlist = JSON.parse(getCookie('watchlist') || '[]');

const assets = OrderedMap(mutableAssets)
  .map((rows, symbol) => List(rows).map(
    (row: any) => {
      row.quantity = +row.quantity;
      row.basis = +row.basis;
      row.tid = +row.tid;
      return new PFTradeItem(row)
    }
  ));
const watchlist = List(mutableWatchlist);

PFDispatcher.dispatch({
  type: PFActionTypes.COOKIE_DATA_LOADED,
  assets,
  watchlist,
});

ReactDOM.render(
  <PFRoot/>,
  document.getElementById('root-container')
);
