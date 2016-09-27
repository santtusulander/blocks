import React from 'react'
import Immutable, { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

const FilterServiceProvider = (props) => {
  const arrayMapping = (option) => { return Immutable.fromJS({ value: option.get('id'), label: option.get('name') }) }
  const serviceProviderOptions = Immutable.fromJS(props.serviceProviderOptions.map(arrayMapping))

  return (
    <div className="action">
      {props.visibleFields.includes('sp-account') && <div>
        <h5>
          <FormattedMessage id="portal.analysis.filters.serviceProvider.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          onChange={props.changeServiceProvider}
          value={props.serviceProviderValue}
          options={serviceProviderOptions}/>
        </div>
      </div>
      }
      {props.visibleFields.includes('sp-group') && <div>
        <h5>
          <FormattedMessage id="portal.analysis.filters.serviceProviderGroups.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          onChange={props.changeServiceProviderGroup}
          value={props.serviceProviderGroupValue}
          options={props.serviceProviderGroupOptions}/>
        </div>
      </div>
      }
    </div>
  );
}

FilterServiceProvider.displayName = 'FilterServiceProvider'
FilterServiceProvider.propTypes = {
  visibleFields: React.PropTypes.array,
  changeServiceProvider: React.PropTypes.func,
  changeServiceProviderGroup: React.PropTypes.func,
  serviceProviderGroupOptions: React.PropTypes.instanceOf(List),
  serviceProviderGroupValue: React.PropTypes.instanceOf(List),
  serviceProviderOptions: React.PropTypes.instanceOf(List),
  serviceProviderValue: React.PropTypes.instanceOf(List)
}

export default FilterServiceProvider
