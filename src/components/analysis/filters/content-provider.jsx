import React from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

const FilterContentProvider = (props) => {
  const arrayMapping = (option) => {
    return Immutable.fromJS({ value: option.get('id'), label: option.get('name') }) 
  }
  const contentProviderOptions = Immutable.fromJS(props.contentProviderOptions.map(arrayMapping))
  const contentProviderGroupOptions = Immutable.fromJS(props.contentProviderGroupOptions.map(arrayMapping))

  return (
    <div className="action action-cols">
      {props.visibleFields.includes('cp-account') && <div className="action-col">
        <h5>
          <FormattedMessage id="portal.analysis.filters.contentProvider.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          disabled={contentProviderOptions.size === 0}
          onChange={props.changeContentProvider}
          value={props.contentProviderValue}
          options={contentProviderOptions}/>
        </div>
      </div>
      }

      {props.visibleFields.includes('cp-group')
        && contentProviderGroupOptions.size !== 0
        && props.contentProviderValue.size === 1 &&
        <div className="action-col">
          <h5>
            <FormattedMessage id="portal.analysis.filters.contentProviderGroups.title"/>
          </h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={props.changeContentProviderGroup}
              value={props.contentProviderGroupValue}
              options={contentProviderGroupOptions}/>
          </div>
        </div>
      }

      {/*
      {props.visibleFields.includes('cp-property') && <div>
        <h5>
          <FormattedMessage id="portal.analysis.filters.contentProviderProperties.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          onChange={props.changeContentProviderProperty}
          value={props.contentProviderPropertyValue}
          options={props.contentProviderPropertyOptions}/>
        </div>
      </div>
      }
      */}
    </div>
  );
}

FilterContentProvider.displayName = 'FilterContentProvider'
FilterContentProvider.propTypes = {
  changeContentProvider: React.PropTypes.func,
  changeContentProviderGroup: React.PropTypes.func,
  // changeContentProviderProperty: React.PropTypes.func,
  contentProviderGroupOptions: React.PropTypes.instanceOf(List),
  contentProviderGroupValue: React.PropTypes.instanceOf(List),
  contentProviderOptions: React.PropTypes.instanceOf(List),
  // contentProviderPropertyOptions: React.PropTypes.instanceOf(List),
  // contentProviderPropertyValue: React.PropTypes.instanceOf(List),
  contentProviderValue: React.PropTypes.instanceOf(List),
  visibleFields: React.PropTypes.array
}

export default FilterContentProvider
