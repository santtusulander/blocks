import React, { PropTypes, Component } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'

import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'

class IsAllowed extends Component {
  render() {
    const { children, currentUser, roles, to } = this.props;
    const isAllowed = checkPermissions(roles, currentUser, to)
    return (
      isAllowed && children
    )
  }
}


IsAllowed.displayName = 'IsAllowed'
IsAllowed.propTypes = {
  children: React.PropTypes.node,
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List),
  to: PropTypes.oneOf(Object.keys(PERMISSIONS))
}

IsAllowed.defaultProps = {
  currentUser: Map(),
  roles: List()
}

function mapStateToProps(state) {
  return {
    roles: state.roles.get('roles'),
    currentUser: state.user.get('currentUser')
  };
}

export default connect(mapStateToProps)(IsAllowed)
