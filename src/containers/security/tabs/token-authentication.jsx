import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as propertyActionCreators from '../../../redux/modules/properties/actions'
import {getProperties, isFetching} from '../../../redux/modules/properties/selectors'

import {getTokenAuthRules} from '../../../util/policy-config'

import TokenAuthList from '../../../components/security/token-auth-list'

class TabTokenAuthentication extends Component {
  componentDidMount(){
    this.fetchData()
  }

  shouldComponentUpdate(){
    return true
  }

  fetchData(){
    const {brand,account,group} = this.props.params
    this.props.fetchProperties(brand,account,group)
  }

  render(){
    const {properties, isFetching} = this.props

    if ( isFetching )
      return <span>fetching...</span>

    const tokenAuthRules = getTokenAuthRules( properties )

    return (
          <TokenAuthList rules={tokenAuthRules} />
    )

  }
}

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
  return {
    properties: getProperties(state, ownProps.params.brand, parseInt(ownProps.params.account), parseInt(ownProps.params.group)),
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
