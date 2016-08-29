import React from 'react'

import Select from '../../../components/select'

export class FilterPop extends React.Component {
  render() {
    return (
      <div>
        <h5>POPs</h5>
        <div className="sidebar-content">
          <Select className="btn-block"
            onSelect={this.props.changePop}
            value={this.props.value}
            options={this.props.options}/>
        </div>
      </div>
    );
  }
}

FilterPop.displayName = 'FilterPop'
FilterPop.propTypes = {
  changePop: React.PropTypes.func,
  options: React.PropTypes.array,
  value: React.PropTypes.string
}

module.exports = FilterPop
