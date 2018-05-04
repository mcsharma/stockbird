import React = require('react');
import '../../css/pf-summary.less';
import classNames = require('classnames');

type Props = {
  type?: 'primary' | 'secondary',
  label: string,
  onClick?: () => void,
  size?: 'small' | 'large'
};

export class PFButton extends React.Component<Props> {

  render() {
    return (
      <button className={classNames({
        'pf-button': true,
        'pf-primary-button': this.props.type === 'primary',
        'pf-button-small': this.props.size === 'small'
      })} onClick={this.props.onClick}>{this.props.label}</button>
    );
  }
}



