import React, { PropTypes, Component, Children } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'

import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'

class IsAllowed extends Component {
  render() {
    const { children, currentUser, roles, to, not } = this.props;
    let isAllowed = checkPermissions(roles, currentUser, to)
    if(not) {
      isAllowed = !isAllowed
    }
    return (
      isAllowed && Children.only(children)
    )
  }
}


IsAllowed.displayName = 'IsAllowed'
IsAllowed.propTypes = {
  children: React.PropTypes.node,
  currentUser: PropTypes.instanceOf(Map),
  not: React.PropTypes.bool,
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
