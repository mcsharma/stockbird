import React = require('react');
import '../../css/pf-summary.less';
import classNames = require('classnames');

type Props = {
  weight?: 'bold' | 'normal',
  size?: number, // default 13px
  color?: 'primary' | 'secondary' | 'heading',
  children: any,
};

export class PFText extends React.Component<Props> {

  render() {
    let color = '';
    switch (this.props.color) {
      case 'heading':
        color = '#1d2129';
        break;
      case 'secondary':
        color = '#939a9e';
        break;
    }

    return (
      <div className={classNames({
        'pf-text': true,
        'pf-text-bold': this.props.weight === 'bold',
      })} style={{color: color, fontSize: this.props.size}}>{this.props.children}</div>
    );
  }
}

