import React from 'react'
import { Radio, FormGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const FilterStorageType = ({ storageType = '', toggleStorageType }) => (
  <div>
    <h5><FormattedMessage id="portal.analysis.filters.storageType.title"/></h5>
    <div className="sidebar-content form-inline">
      <FormGroup>
        <Radio
          checked={storageType.includes('usage')}
          onChange={() => toggleStorageType('usage')}>
          <span>{<FormattedMessage id="portal.analysis.filters.storageType.usage.title"/>}</span>
        </Radio>
      </FormGroup>
      <FormGroup>
        <Radio
          checked={storageType.includes('files')}
          onChange={() => toggleStorageType('files')}>
         <span>{<FormattedMessage id="portal.analysis.filters.storageType.files.title"/>}</span>
        </Radio>
      </FormGroup>
    </div>
  </div>
)

FilterStorageType.displayName = 'FilterStorageType'
FilterStorageType.propTypes = {
  storageType: React.PropTypes.string,
  toggleStorageType: React.PropTypes.func
}

export default FilterStorageType
