import React from 'react'
import Immutable, { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/shared/form-elements/filter-checklist-dropdown'

const FilterServiceProvider = (props) => {
  const arrayMapping = (option) => {
    return Immutable.fromJS({ value: option.get('id'), label: option.get('name') })
  }
  const serviceProviderOptions = Immutable.fromJS(props.serviceProviderOptions.map(arrayMapping))
  const serviceProviderGroupOptions = Immutable.fromJS(props.serviceProviderGroupOptions.map(arrayMapping))

  return (
    <div className="action action-cols">
      {props.visibleFields.includes('sp-account') && <div className="action-col">
        <h5>
          <FormattedMessage id="portal.analysis.filters.serviceProvider.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          disabled={serviceProviderOptions.size === 0}
          onChange={props.changeServiceProvider}
          value={props.serviceProviderValue}
          options={serviceProviderOptions}/>
        </div>
      </div>
      }

      {props.visibleFields.includes('sp-group')
        && serviceProviderGroupOptions.size !== 0
        && props.serviceProviderValue.size === 1 &&
        <div className="action-col">
          <h5>
            <FormattedMessage id="portal.analysis.filters.serviceProviderGroups.title"/>
          </h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={props.changeServiceProviderGroup}
              value={props.serviceProviderGroupValue}
              options={serviceProviderGroupOptions}/>
          </div>
        </div>
      }
    </div>
  );
}

FilterServiceProvider.displayName = 'FilterServiceProvider'
FilterServiceProvider.propTypes = {
  changeServiceProvider: React.PropTypes.func,
  changeServiceProviderGroup: React.PropTypes.func,
  serviceProviderGroupOptions: React.PropTypes.instanceOf(List),
  serviceProviderGroupValue: React.PropTypes.instanceOf(List),
  serviceProviderOptions: React.PropTypes.instanceOf(List),
  serviceProviderValue: React.PropTypes.instanceOf(List),
  visibleFields: React.PropTypes.array
}
FilterServiceProvider.defaultProps = {
  serviceProviderGroupOptions: List(),
  serviceProviderGroupValue: List(),
  serviceProviderOptions: List(),
  serviceProviderValue: List()
}

export default FilterServiceProvider
