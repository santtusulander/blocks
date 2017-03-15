import { PropTypes, Component, Children } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'

class HasServicePermission extends Component {
  render() {
    const { children, servicePermissions, allOf, anyOf } = this.props
    let hasAllPermissions = false
    let hasAnyPermissions = false

    if (allOf.length) {
      hasAllPermissions = !allOf.find(permission => !servicePermissions.contains(permission))
    }
    
    if (anyOf.length) {
      hasAnyPermissions = !!anyOf.find(permission => servicePermissions.contains(permission))
    }

    return (
      (hasAllPermissions || hasAnyPermissions) && Children.only(children)
    )
  }
}

HasServicePermission.displayName = 'HasServicePermission'
HasServicePermission.propTypes = {
  allOf: PropTypes.array,
  anyOf: PropTypes.array,
  children: PropTypes.node,
  servicePermissions: PropTypes.instanceOf(List)
}

HasServicePermission.defaultProps = {
  allOf: [],
  anyOf: [],
  servicePermissions: List()
}

function mapStateToProps(state) {
  return {
    servicePermissions: state.group.get('servicePermissions')
  };
}

export default connect(mapStateToProps)(HasServicePermission)
