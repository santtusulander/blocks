import React, { PropTypes, Component, Children } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'

import * as PERMISSIONS from '../constants/service-permissions'

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
  permission: PropTypes.oneOf(Object.keys(PERMISSIONS)),
  servicePermissions: PropTypes.instanceOf(List)
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
