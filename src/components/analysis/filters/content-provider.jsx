import React from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

const FilterContentProvider = (props) => {
  return (
    <div className="action">
      {props.visibleFields.includes('cp-account') && <div>
        <h5>
          <FormattedMessage id="portal.analysis.filters.contentProvider.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          onChange={props.changeContentProvider}
          value={props.contentProviderValue}
          options={props.contentProviderOptions}/>
        </div>
      </div>
      }

      {props.visibleFields.includes('cp-group') && <div>
        <h5>
          <FormattedMessage id="portal.analysis.filters.contentProviderGroups.title"/>
        </h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
          onChange={props.changeContentProviderGroup}
          value={props.contentProviderGroupValue}
          options={props.contentProviderGroupOptions}/>
        </div>
      </div>
      }

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
    </div>
  );
}

FilterContentProvider.displayName = 'FilterContentProvider'
FilterContentProvider.propTypes = {
  visibleFields: React.PropTypes.array,
  changeContentProvider: React.PropTypes.func,
  changeContentProviderGroup: React.PropTypes.func,
  changeContentProviderProperty: React.PropTypes.func,
  contentProviderGroupOptions: React.PropTypes.instanceOf(List),
  contentProviderGroupValue: React.PropTypes.instanceOf(List),
  contentProviderOptions: React.PropTypes.instanceOf(List),
  contentProviderPropertyOptions: React.PropTypes.instanceOf(List),
  contentProviderPropertyValue: React.PropTypes.instanceOf(List),
  contentProviderValue: React.PropTypes.instanceOf(List)
}

export default FilterContentProvider
