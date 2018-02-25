import React = require('react');
import {PFSymbolToStockDataPoint} from '../types/types';
import {PFMarketNumber} from './PFMarketNumber';
import {formatNum} from '../util';

type Props = {
  marketData: PFSymbolToStockDataPoint,
  marketFundCostBasis: number,
  marketFundValue: number | null,
  marketFundPreviousCloseValue: number | null,
  soldFundCostBasis: number,
  soldFundValue: number,
};

export class PFSummary extends React.Component<Props> {
  render() {
    return (
      <div className="pf-card">
        <div className="pf-summary">
          <div className="pf-summary-day-change">
            <div className="pf-summary-item-label">Day Change</div>
            <PFMarketNumber current={this.props.marketFundValue} previous={this.props.marketFundPreviousCloseValue}
                            showGreenOnNeutral={true}/>
          </div>
          <div className="pf-summary-unrealized">
            <div className="pf-summary-item-label">Unrealized (G/L)</div>
            <PFMarketNumber current={this.props.marketFundValue} previous={this.props.marketFundCostBasis}/>
            <div className="pf-market-fund-value">
              ({this.props.marketFundValue === null ? '...' : formatNum(this.props.marketFundValue)} asset value)
            </div>
          </div>
          <div className="pf-summary-realized">
            <div className="pf-summary-item-label">Realized (G/L)</div>
            <PFMarketNumber current={this.props.soldFundValue} previous={this.props.soldFundCostBasis}/>
          </div>
          <div className="pf-summary-overall">
            <div className="pf-summary-item-label">Overall (G/L)</div>
            {this.props.marketFundValue === null ? '...' :
              <PFMarketNumber current={this.props.soldFundValue + this.props.marketFundValue}
                              previous={this.props.soldFundCostBasis + this.props.marketFundCostBasis}/>}
          </div>
        </div>
      </div>
    );
  }
}
