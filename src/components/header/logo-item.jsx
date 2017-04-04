import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { Link } from 'react-router'

import * as PERMISSIONS from '../../constants/permissions.js'
import { getRoute } from '../../util/routes'
import { userIsServiceProvider } from '../../util/helpers.js'
import IsAllowed from '../is-allowed'
import IconEricsson from '../shared/icons/icon-ericsson.jsx'

const LogoItem = (props) => {
  const {user} = props

  const logoLink = userIsServiceProvider(user) ?
    getRoute('networkAccount', {brand: 'udn', account: user.get('account_id')}) :
    getRoute('contentAccount', {brand: 'udn', account: user.get('account_id')})

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

LogoItem.displayName = 'LogoItem'
LogoItem.propTypes = {
  user: PropTypes.instanceOf(Map)
}
LogoItem.defaultProps = {
  user: Map()
}

export default LogoItem
