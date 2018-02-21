import React = require('react');
import '../../css/pf-summary.less';
import {List, OrderedMap} from 'immutable';
import {PFSymbol, PFSymbolToStockDataPoint} from '../types/types';
import {PFTradeItem} from '../types/pf-trade-items';
import classNames = require('classnames');
import {format} from '../util';

type Props = {
  assets: OrderedMap<PFSymbol, List<PFTradeItem>>,
  marketData: PFSymbolToStockDataPoint,
  dayChange: number | null,
  dayChangePercent: number | null,
  overallGain: number | null,
  overallGainPercent: number | null,
  totalValue: number | null,
  totalBasis: number | null,
};

export class PFSummary extends React.Component<Props> {
  render() {
    let hasDayLoss = this.props.dayChange !== null && this.props.dayChange < -1e-6;
    let hasDayProfit = this.props.dayChange !== null && this.props.dayChange > 1e-6;
    let hasOverallProfit = this.props.overallGain !== null && this.props.overallGain > 1e-6;
    let hasOverallLoss = this.props.overallGain !== null && this.props.overallGain < -1e-6;

    let dayChange = '...';
    if (this.props.dayChange !== null) {
      dayChange = format(this.props.dayChange.toFixed(2));
      if (hasDayProfit) {
        dayChange = '+' + dayChange;
      }
    }
    let dayChangePercent = '';
    if (this.props.dayChangePercent !== null) {
      dayChangePercent = this.props.dayChangePercent.toFixed(2) + '%';
      dayChangePercent = '(' + dayChangePercent + ')';
    }

    let overallGain = '';
    if (this.props.overallGain !== null) {
      overallGain = this.props.overallGain.toFixed(2);
      if (hasOverallProfit) {
        overallGain = '+' + overallGain;
      }
    }

    let overallGainPercent = null;
    if (this.props.overallGainPercent !== null) {
      overallGainPercent = this.props.overallGainPercent.toFixed(2) + '%';
      overallGainPercent = '(' + overallGainPercent + ')';
    }



    return <div className="pf-summary">
      <div>
        <div className="pf-summary-item-label">Day Change</div>
        <div
          className={classNames({'pf-color-red': hasDayLoss, 'pf-color-green': hasDayProfit})}>
          {dayChange}
          {' '}
          {dayChangePercent}
        </div>
      </div>
      <div>
        <div className="pf-summary-item-label">Overall Gain/Loss</div>
        <div
          className={classNames({'pf-color-red': hasOverallLoss, 'pf-color-green': hasOverallProfit})}>
          {overallGain}
          {' '}
          {overallGainPercent}
        </div>
      </div>
      <div>
        <div className="pf-summary-item-label">Total Value</div>
        <div> {this.props.totalValue === null ? '...' : format(this.props.totalValue.toFixed(2))}</div>
      </div>
      <div>
        <div className="pf-summary-item-label">Cost Basis</div>
        <div> {format(this.props.totalBasis.toFixed(2))}</div>
      </div>
    </div>;
  }
}
