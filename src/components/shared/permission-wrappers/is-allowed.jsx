import { PropTypes, Children, Component } from 'react'
import { Map } from 'immutable'

import * as PERMISSIONS from '../../../constants/permissions.js'
import checkPermissions from '../../../util/permissions'

class IsAllowed extends Component {
  render() {
    const { children,  to, not } = this.props;
    const { currentUser, roles } = this.context;

    let isAllowed = checkPermissions(roles, currentUser, to)
    if (not) {
      isAllowed = !isAllowed
    }
    return (
      !!isAllowed && Children.only(children)
    )
  }
}

IsAllowed.displayName = 'IsAllowed'

IsAllowed.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(Map)
}

IsAllowed.propTypes = {
  children: PropTypes.node,
  not: PropTypes.bool,
  to: PropTypes.oneOf(Object.keys(PERMISSIONS))
}

export default IsAllowed
