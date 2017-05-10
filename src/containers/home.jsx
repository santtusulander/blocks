import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Immutable from 'immutable'

import { getRoute } from '../util/routes'

import {
  accountIsServiceProviderType,
  accountIsContentProviderType,
  userIsServiceProvider,
  userIsContentProvider
} from '../util/helpers'

/* Home is container for initial redirect */
class Home extends React.Component {
  componentDidMount() {
    const { activeAccount, currentUser, router } = this.props

    const isSP = userIsServiceProvider(currentUser) || accountIsServiceProviderType(activeAccount)
    const isCP = userIsContentProvider(currentUser) || accountIsContentProviderType(activeAccount)
    const isUDNAdmin = !isSP && !isCP

    const accountId = currentUser.get('account_id')
    const brandName = 'udn'
    const params = {
      brand: brandName,
      account: accountId
    }

    if (isSP) {
      router.replace(getRoute('dashboardAccount', params))
    } else if (isCP) {
      router.replace(getRoute('contentAccount', params))
    } else if (isUDNAdmin) {
      router.replace(getRoute('dashboardBrand', { brand: brandName }))
    } else if (accountId) {
      router.replace(getRoute('contentAccount', params))
    } else {
      router.replace(getRoute('contentBrand', { brand: brandName }))
    }
  }

  render() {
    return null
  }
}

Home.displayName = 'Navigation'
Home.propTypes = {
  activeAccount: React.PropTypes.object,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  router: React.PropTypes.object
}

/* istanbul ignore next */
const mapStateToProps = (state) => {
  return {
    currentUser: state.user.get('currentUser')
  }
}


export default connect(mapStateToProps)(withRouter(Home))
