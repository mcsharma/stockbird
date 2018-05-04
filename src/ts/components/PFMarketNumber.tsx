import React = require('react');
import '../../css/pf-summary.less';
import classNames = require('classnames');
import {formatGainOrLoss, formatInt} from '../util';

type Props = {
  current: number | null,
  previous?: number | null,
  showGreenOnNeutral?: boolean, // default is false.
  showPercent?: boolean, // default is true
  showCurrentValue?: boolean, // default is false
  isQuantity?: boolean, // default is false.
};

export class PFMarketNumber extends React.Component<Props> {

  render() {
    if (this.props.isQuantity === true) {
      <div className="pf-market-num">{formatInt(this.props.current)}</div>
    }
    if (this.props.current === null || this.props.previous === null) {
      return <div className="pf-market-num">...</div>;
    }
    let isProfit = this.props.current - this.props.previous > 1e-6;
    const isLoss = this.props.current - this.props.previous < -1e-6;
    if (!isProfit && !isLoss && this.props.showGreenOnNeutral === true) {
      isProfit = true;
    }
    return (
      <div
        className={classNames({'pf-market-num': true, 'pf-color-red': isLoss, 'pf-color-green': isProfit})}>
        {formatGainOrLoss(this.props.current, this.props.previous, {
          showPercent: this.props.showPercent !== false,
          showCurrentValue: this.props.showCurrentValue
        })}
      </div>
    );
  }
}


