import React, { PropTypes, Component, Children } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'

import * as PERMISSIONS from '../constants/service-permissions.js'

class HasServicePermission extends Component {
  render() {
    const { children, servicePermissions, permission } = this.props;

    return (
      servicePermissions.contains(permission) && Children.only(children)
    )
  }
}

HasServicePermission.displayName = 'HasServicePermission'
HasServicePermission.propTypes = {
  children: React.PropTypes.node,
  servicePermissions: PropTypes.instanceOf(List),
  permission: PropTypes.oneOf(Object.keys(PERMISSIONS))
}

HasServicePermission.defaultProps = {
  servicePermissions: List()
}

function mapStateToProps(state) {
  return {
    servicePermissions: state.group.get('servicePermissions')
  };
}

export default connect(mapStateToProps)(HasServicePermission)
