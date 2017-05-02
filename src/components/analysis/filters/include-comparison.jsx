import React from 'react'
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'react-bootstrap'

const FilterIncludeComparison = (props) => {
  return (
    <Checkbox
      className="comparison-filter"
      checked={props.includeComparison}
      onChange={() => props.toggleComparison(!props.includeComparison)}>
      <FormattedMessage id="portal.analysis.filters.includeComparison.label" />
    </Checkbox>
  )
}

FilterIncludeComparison.displayName = 'FilterIncludeComparison'
FilterIncludeComparison.propTypes = {
  includeComparison: React.PropTypes.bool,
  toggleComparison: React.PropTypes.func
}

export default FilterIncludeComparison
