import React from 'react'

import Select from '../../../components/select'

export class FilterServiceProvider extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          Service Providers
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              onSelect={this.props.changeServiceProvider}
              value={this.props.value}
              options={this.props.options}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterServiceProvider.displayName = 'FilterServiceProvider'
FilterServiceProvider.propTypes = {
  changeServiceProvider: React.PropTypes.func,
  options: React.PropTypes.array,
  value: React.PropTypes.string
}

module.exports = FilterServiceProvider
