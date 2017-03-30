import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import * as PERMISSIONS from '../../constants/permissions.js'
import { getRoute } from '../../util/routes'
import { userIsServiceProvider } from '../../util/helpers.js'
import IsAllowed from '../is-allowed'
import IconEricsson from '../icons/icon-ericsson.jsx'

class LogoItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logoLink: ''
    }

    this.updateLogoLink = this.updateLogoLink.bind(this)
  }

  componentDidMount() {
    this.updateLogoLink(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    this.updateLogoLink(nextProps.user)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.logoLink !== nextState.logoLink) {
      return true
    }

    return false
  }

  updateLogoLink(user) {
    const logoLink = userIsServiceProvider(user) ?
      getRoute('dashboardAccount', {brand: 'udn', account: user.get('account_id')}) :
      getRoute('contentAccount', {brand: 'udn', account: user.get('account_id')})

    this.setState({ logoLink })
  }

  render() {
    const { logoLink } = this.state

    return (
      <li className="header__logo">
        <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
          <Link to={getRoute('content', { brand: 'udn' })} className="logo">
            <IconEricsson />
          </Link>
        </IsAllowed>
        <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
          <Link to={logoLink} className="logo">
            <IconEricsson />
          </Link>
        </IsAllowed>
      </li>
    )
  }
}

LogoItem.displayName = 'LogoItem'
LogoItem.propTypes = {
  user: PropTypes.instanceOf(Immutable.Map)
}
LogoItem.defaultProps = {
  user: new Immutable.Map()
}

export default LogoItem
