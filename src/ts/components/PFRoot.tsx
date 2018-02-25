import * as React from 'react';
import PFSummaryContainer from '../containers/PFSummaryContainer';

import PFUnsoldStocksContainer from '../containers/PFUnsoldStocksContainer';
import {recursivelyFetchAndUpdateStockData} from '../stock-data-fetch';
import PFSoldStocksContainer from '../containers/PFSoldStocksContainer';

import '../../css/pf-root.less';
import '../../css/pf-card.less';
import '../../css/pf-sold-stocks.less';
import '../../css/pf-summary.less';

import PFWatchlistContainer from '../containers/PFWatchlistContainer';


type Props = {};

export class PFRoot extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    recursivelyFetchAndUpdateStockData();
  }

  render() {
    return (
      <div className="pf-root">
        <div className="pf-chrome"></div>
        <div className="pf-body">
          <div className="pf-left-col">
            <div style={{marginTop: '20px'}}>
              <div className="pf-main-item-label">Summary</div>
              <PFSummaryContainer/>
            </div>
            <div style={{marginTop: '20px'}}>
              <div className="pf-main-item-label">Unsold Stocks</div>
              <PFUnsoldStocksContainer/>
            </div>
            <div style={{marginTop: '20px'}}>
              <div className="pf-main-item-label">Sold Stocks</div>
              <PFSoldStocksContainer/>
            </div>
          </div>
          <div className="pf-right-col">
            <div style={{marginTop: '20px'}}>
              <div className="pf-main-item-label">Watchlist</div>
              <PFWatchlistContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
