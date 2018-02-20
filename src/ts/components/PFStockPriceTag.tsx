import React = require('react');
import {PFTradeItem} from '../types/pf-trade-items';
import {PFSymbolToStockDataPoint, PriceDisplayMode} from '../types/types';
import '../../css/pf-aggregated-row.less';

import classNames = require('classnames');
import {format} from '../util';
import {PFDispatcher} from '../dispatcher/PFDispatcher';
import PFActionTypes from '../types/PFActionTypes';

type Props = {
  price: number | null;
  priceDisplayMode: PriceDisplayMode;
  previousClose: number | number;
};

type State = {}

export class PFStockPriceTag extends React.Component<Props, State> {

  _onClick = (event) => {
    event.stopPropagation();
    PFDispatcher.dispatch({
      type: PFActionTypes.UNSOLD_PRICE_DISPLAY_MODE_CHANGE,
    });
  };

  render() {
    const curPrice = this.props.price;
    const lastClose = this.props.previousClose;
    const priceNeutral = curPrice === null
      || Math.abs(curPrice - lastClose) < 1e-6;
    const priceIncreased = !priceNeutral && curPrice > lastClose;
    const priceDecreased = !priceNeutral && curPrice < lastClose;

    let priceDisplay = '...';
    if (curPrice !== null && this.props.priceDisplayMode === PriceDisplayMode.PER_SHARE_PRICE) {
      priceDisplay = format(curPrice.toFixed(2));
    } else if (curPrice !== null && lastClose !== null && this.props.priceDisplayMode === PriceDisplayMode.PERCENT_CHANGE) {
      let percentChange = curPrice && lastClose &&
        ((curPrice - lastClose) * 100 / lastClose).toFixed(2) || null;
      if (percentChange && percentChange[0] !== '-') {
        percentChange = '+' + percentChange;
      }
      priceDisplay = percentChange + '%';
    }

    return (<div
      onClick={this._onClick}
      className={classNames({
        'pf-price': true,
        'pf-price-green': priceIncreased || priceNeutral,
        'pf-price-red': priceDecreased
      })}>
      {priceDisplay}
    </div>);

  }
}
