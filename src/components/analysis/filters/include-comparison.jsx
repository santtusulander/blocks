import React from 'react'
import {connect} from 'react-redux'
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux'
import { Checkbox } from 'react-bootstrap'

import * as uiActionCreators from '../../../redux/modules/ui'


class FilterIncludeComparison extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Checkbox
        className="comparison-filter"
        checked={this.props.includeComparison}
        onChange={() => this.props.toggleComparison(!this.props.includeComparison)}>
        <FormattedMessage id="portal.analysis.filters.includeComparison.label" />
      </Checkbox>
    );
  }
}

FilterIncludeComparison.displayName = 'FilterIncludeComparison'
FilterIncludeComparison.propTypes = {
  includeComparison: React.PropTypes.bool,
  toggleComparison: React.PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}
export default connect(null, mapDispatchToProps)(FilterIncludeComparison)
