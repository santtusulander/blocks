import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Input} from 'react-bootstrap'

import * as uiActionCreators from '../../../redux/modules/ui'


class FilterIncludeComparison extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="sidebar-content">
          <Input type="checkbox" label="Versus Previous Date Range"
            checked={this.props.includeComparison}
            onChange={() => this.props.toggleComparison(!this.props.includeComparison)} />
        </div>
      </div>
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
