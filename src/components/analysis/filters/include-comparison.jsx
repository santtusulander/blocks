import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Input} from 'react-bootstrap'

import * as uiActionCreators from '../../../redux/modules/ui'

// import {FormattedMessage} from 'react-intl'

class FilterIncludeComparison extends React.Component {
  constructor(props) {
    super(props);

    // this.toggleServiceType = this.toggleServiceType.bind(this)
  }
  // toggleServiceType(type) {
  //   return () => {
  //     // TODO: Maybe some general error messaging box?
  //     if(this.props.serviceTypes.size === 1 && this.props.serviceTypes.includes(type)) {
  //       this.props.uiActions.showInfoDialog({
  //         title: <FormattedMessage id="portal.analytics.noServiceTypeSelected.title"/>,
  //         content: <FormattedMessage id="portal.analytics.noServiceTypeSelected.text"/>,
  //         buttons: <Button onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary"><FormattedMessage id="portal.button.ok"/></Button>
  //       });
  //     }
  //     else {
  //       this.props.toggleServiceType(type)
  //     }
  //   }
  // }
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
