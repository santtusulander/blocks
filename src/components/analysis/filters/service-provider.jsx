import React from 'react'
import Immutable, { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

export class FilterServiceProvider extends React.Component {
  render() {
    const arrayMapping = (option) => { return Immutable.fromJS({ value: option.get('id'), label: option.get('name') }) }
    const serviceProviderOptions = Immutable.fromJS(this.props.serviceProviderOptions.map(arrayMapping))

    return (
      <div className="action">
        <div>
          <h5><FormattedMessage id="portal.analysis.filters.serviceProvider.title"/></h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={this.props.changeServiceProvider}
              value={this.props.serviceProviderValue}
              options={serviceProviderOptions}/>
          </div>
        </div>
        <div>
          <h5><FormattedMessage id="portal.analysis.filters.serviceProviderGroups.title"/></h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={this.props.changeServiceProviderGroup}
              value={this.props.serviceProviderGroupValue}
              options={this.props.serviceProviderGroupOptions}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterServiceProvider.displayName = 'FilterServiceProvider'
FilterServiceProvider.propTypes = {
  changeServiceProvider: React.PropTypes.func,
  changeServiceProviderGroup: React.PropTypes.func,
  serviceProviderGroupOptions: React.PropTypes.instanceOf(List),
  serviceProviderGroupValue: React.PropTypes.instanceOf(List),
  serviceProviderOptions: React.PropTypes.instanceOf(List),
  serviceProviderValue: React.PropTypes.instanceOf(List)
}

module.exports = FilterServiceProvider
