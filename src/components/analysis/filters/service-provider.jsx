import React from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import Select from '../../../components/select'

export class FilterServiceProvider extends React.Component {
  render() {
    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.serviceProvider.title"/></h5>
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
  options: React.PropTypes.instanceOf(List),
  value: React.PropTypes.instanceOf(List)
}

module.exports = FilterServiceProvider
