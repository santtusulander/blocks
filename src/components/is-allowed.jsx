import React, { PropTypes, Children } from 'react'
import { List, Map } from 'immutable'

import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'

const IsAllowed = (props, context) => {
  const { children,  to, not } = props;
  const { currentUser, roles } = context;

  let isAllowed = checkPermissions(roles, currentUser, to)
  if(not) {
    isAllowed = !isAllowed
  }
  return (
    isAllowed && Children.only(children)
  )
}

IsAllowed.displayName = 'IsAllowed'

IsAllowed.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List)
}

IsAllowed.propTypes = {
  children: React.PropTypes.node,
  not: React.PropTypes.bool,
  to: PropTypes.oneOf(Object.keys(PERMISSIONS))
}

export default IsAllowed
