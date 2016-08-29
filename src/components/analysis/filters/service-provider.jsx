import React from 'react'

import Select from '../../../components/select'

export class FilterServiceProvider extends React.Component {
  render() {
    return (
      <div>
        <h5>Service Providers</h5>
        <div className="sidebar-content">
          <Select className="btn-block"
            onSelect={this.props.changeServiceProvider}
            value={this.props.value}
            options={this.props.options}/>
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
