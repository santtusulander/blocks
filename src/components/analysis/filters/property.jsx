import React from 'react'
import { FormattedMessage } from 'react-intl'

import Select from '../../../components/shared/form-elements/select'

export class FilterProperty extends React.Component {
  render() {
    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.property.title"/></h5>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              value='all'
              options={[['all', 'All']]}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterProperty.displayName = 'FilterProperty'
FilterProperty.propTypes = {}

module.exports = FilterProperty
