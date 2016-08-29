import React from 'react'

import Select from '../../../components/select'

export class FilterProperty extends React.Component {
  render() {
    return (
      <div>
        <h5>Properties</h5>
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
