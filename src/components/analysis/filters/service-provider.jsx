import React from 'react'
import Immutable, { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

export class FilterServiceProvider extends React.Component {
  render() {
    // debugger;
    //
    const arrayMapping = (option) => { return Immutable.fromJS({ value: option.get('id'), label: option.get('name') }) }
    const options = Immutable.fromJS(this.props.options.map(arrayMapping))

    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.serviceProvider.title"/></h5>
        <div className="sidebar-content">
          <FilterChecklistDropdown className="btn-block"
            onChange={this.props.changeServiceProvider}
            value={this.props.value}
            options={options}/>
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
