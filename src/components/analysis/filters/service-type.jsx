import React from 'react'
import Immutable from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Input, Button} from 'react-bootstrap'

import * as uiActionCreators from '../../../redux/modules/ui'

import {FormattedMessage} from 'react-intl'

class FilterServiceType extends React.Component {
  constructor(props) {
    super(props);

    this.toggleServiceType = this.toggleServiceType.bind(this)
  }
  toggleServiceType(type) {
    return () => {
      // TODO: Maybe some general error messaging box?
      if(this.props.serviceTypes.size === 1 && this.props.serviceTypes.includes(type)) {
        this.props.uiActions.showInfoDialog({
          title: <FormattedMessage id="portal.analytics.noServiceTypeSelected.title"/>,
          content: <FormattedMessage id="portal.analytics.noServiceTypeSelected.text"/>,
          buttons: <Button onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary"><FormattedMessage id="portal.button.ok"/></Button>
        });
      }
      else {
        this.props.toggleServiceType(type)
      }
    }
  }
  render() {
    return (
      <div>
        <div className="sidebar-content">
          <Input type="checkbox" label="HTTP"
            checked={this.props.serviceTypes.includes('http')}
            onChange={this.toggleServiceType('http') } />
          <Input type="checkbox" label="HTTPS"
            checked={this.props.serviceTypes.includes('https')}
            onChange={this.toggleServiceType('https') }/>
        </div>
      </div>
    );
  }
}

FilterServiceType.displayName = 'FilterServiceType'
FilterServiceType.propTypes = {
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  toggleServiceType: React.PropTypes.func
}
FilterServiceType.defaultProps = {
  serviceTypes: Immutable.List()
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}
export default connect(null, mapDispatchToProps)(FilterServiceType)
