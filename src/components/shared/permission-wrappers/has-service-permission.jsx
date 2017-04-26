import { PropTypes, Component, Children } from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getServicePermissions } from '../../../util/services-helpers'

class HasServicePermission extends Component {
  render() {
    const { children, allOf, anyOf } = this.props
    const { params } = this.context
    const servicePermissions = this.props.getPermissions 
                               ? this.props.getPermissions(params)
                               : List()

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
  getPermissions: PropTypes.func
}

HasServicePermission.defaultProps = {
  allOf: [],
  anyOf: []
}

HasServicePermission.contextTypes = {
  params: PropTypes.object
}

function mapStateToProps(state) {
  return {
    getPermissions: ({ group }) => {
      const activeGroup = getGroupById(state, group)
      
      return getServicePermissions(activeGroup)
    }
  }
}

export default connect(mapStateToProps)(HasServicePermission)
