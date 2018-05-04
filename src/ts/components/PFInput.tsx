import React = require('react');
import '../../css/pf-summary.less';
import classNames = require('classnames');

type Props = {
  value: string,
  onChange: (val: string) => void,
  placeholder?: string,
  width?: number,
  size?: 'small' | 'large' // default is large
};

export class PFInput extends React.Component<Props> {

  render() {
    const style: any = {};
    if (this.props.width) {
      style.width = this.props.width;
    }
    return (
      <input className={classNames({
        'pf-input': true,
        'pf-input-small': this.props.size === 'small',
      })} value={this.props.value} onChange={this._onChange} placeholder={this.props.placeholder} style={style}/>
    );
  }

  _onChange = (evt) => {
    this.props.onChange(evt.target.value);
  }
}

