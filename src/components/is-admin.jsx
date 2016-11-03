import React, { PropTypes, Component, Children } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'

class IsAdmin extends Component {
  render() {
    const { children, currentUser } = this.props;

    const isAdmin = false; //currentUser.get('roles').contains(1)

    return (
      isAdmin && Children.only(children)
    )
  }
}


IsAdmin.displayName = 'IsAdmin'
IsAdmin.propTypes = {
  children: React.PropTypes.node,
  currentUser: PropTypes.instanceOf(Map)
}

IsAdmin.defaultProps = {
  currentUser: Map()
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.get('currentUser')
  };
}

export default connect(mapStateToProps)(IsAdmin)
