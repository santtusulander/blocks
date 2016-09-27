import React from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

export class FilterContentProvider extends React.Component {
  render() {
    return (
      <div className="action">
        <div>
          <h5><FormattedMessage id="portal.analysis.filters.contentProvider.title"/></h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={this.props.changeContentProvider}
              value={this.props.contentProviderValue}
              options={this.props.contentProviderOptions}/>
          </div>
        </div>
        <div>
          <h5><FormattedMessage id="portal.analysis.filters.contentProviderGroups.title"/></h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={this.props.changeContentProviderGroup}
              value={this.props.contentProviderGroupValue}
              options={this.props.contentProviderGroupOptions}/>
          </div>
        </div>
        <div>
          <h5><FormattedMessage id="portal.analysis.filters.contentProviderProperties.title"/></h5>
          <div className="sidebar-content">
            <FilterChecklistDropdown className="btn-block"
              onChange={this.props.changeContentProviderProperty}
              value={this.props.contentProviderPropertyValue}
              options={this.props.contentProviderPropertyOptions}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterContentProvider.displayName = 'FilterContentProvider'
FilterContentProvider.propTypes = {
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

module.exports = FilterContentProvider
