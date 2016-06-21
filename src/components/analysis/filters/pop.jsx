import React from 'react'

import Select from '../../../components/select'

export class FilterPop extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          POPs
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              onSelect={this.props.changePop}
              value={this.props.value}
              options={this.props.options}/>
          </div>
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
