import * as React from 'react';
import PFSummaryContainer from '../containers/PFSummaryContainer';

import '../../css/pf-root.less';
import PFUnsoldStocksContainer from '../containers/PFUnsoldStocksContainer';
import {recursivelyFetchStockData} from '../stock-data-fetch';

type Props = {};

export class PFRoot extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    recursivelyFetchStockData();
  }

  render() {
    return (
      <div className="pf-root">
        <div className="pf-chrome"></div>
        <div className="pf-body">
          <div style={{marginTop: '20px'}}>
            <div className="pf-main-item-label">Summary</div>
            <PFSummaryContainer/>
          </div>
          <div style={{marginTop: '20px'}}>
            <div className="pf-main-item-label">Unsold Stocks</div>
            <PFUnsoldStocksContainer />
          </div>
        </div>
      </div>
    );
  }
}
