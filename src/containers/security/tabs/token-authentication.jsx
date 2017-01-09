import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as propertyActionCreators from '../../../redux/modules/properties/actions'
import {getProperties, isFetching} from '../../../redux/modules/properties/selectors'

import { getTokenAuthRules } from '../../../util/policy-config'
import { getContentUrl, getRoute } from '../../../util/routes'

import TokenAuthList from '../../../components/security/token-auth-list'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

class TabTokenAuthentication extends Component {
  componentDidMount(){
    this.fetchData()
  }

  fetchData(){
    const {brand,account,group} = this.props.params
    this.props.fetchProperties(brand,account,group)
  }

  render(){
    const {properties, isFetching} = this.props

    const editUrlBuilder = (property, policyParams) => editOrDelete =>
      `${getContentUrl('propertyConfiguration', property, this.props.params)}/policies/${getRoute('configurationTabPoliciesEditPolicy', { ...policyParams, editOrDelete })}`

    if ( isFetching )
      return <LoadingSpinner />

    const tokenAuthRules = getTokenAuthRules( properties )

    return (
          <TokenAuthList rules={tokenAuthRules} editUrlBuilder={editUrlBuilder}/>
    )

  }
}

TabTokenAuthentication.displayName = 'TabTokenAuthentication'

TabTokenAuthentication.propTypes = {
  fetchProperties: PropTypes.func,
  isFetching: PropTypes.bool,
  params: PropTypes.object,
  properties: PropTypes.object
}

TabTokenAuthentication.defaultProps = {
  properties: {}
}

const mapStateToProps = (state, ownProps) => {
  const {params: {brand, account, group} } = ownProps
  return {
    properties: getProperties(state, brand, parseInt(account), parseInt(group)).toJS(),
    isFetching: isFetching(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  const propertyActions = bindActionCreators(propertyActionCreators, dispatch)

  const fetchProperties = (brand, account, group) => {
    propertyActions.startFetching()
    propertyActions.fetchAllWithDetails(brand,account,group)
  }

  return {
    propertyActions,
    fetchProperties
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TabTokenAuthentication))
