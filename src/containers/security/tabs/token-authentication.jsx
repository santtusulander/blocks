import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import { getById } from '../../../redux/modules/entities/accounts/selectors'

import groupActions from '../../../redux/modules/entities/groups/actions'
import { getByAccount as getGroupsByAccount } from '../../../redux/modules/entities/groups/selectors'

import propertyActions from '../../../redux/modules/entities/properties/actions'
import { getByGroup as getPropertiesByGroup, getByAccount as getPropetiesByAccount } from '../../../redux/modules/entities/properties/selectors'

import { getTokenAuthRules } from '../../../util/policy-config'
import { getContentUrl, getRoute } from '../../../util/routes'

import { getFetchingByTag } from '../../../redux/modules/fetching//selectors'

import TokenAuthList from '../../../components/security/token-auth-list'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

const REQUEST_TAG = 'req-token-auth'

class TabTokenAuthentication extends Component {
  componentDidMount(){
    this.fetchData()
  }

  fetchData(){
    const {brand,account, group} = this.props.params

    if (group) {
      this.props.fetchProperties({brand, account, group})
    } else {
      /* Fetch all groups and properties */
      this.props.fetchGroups(this.props.params)
        .then( () => {
          this.props.groups.map( group => {
            this.props.fetchProperties({brand, account, group: group.get('id')})
          })
        })
    }
  }

  render(){
    const {properties, isFetching} = this.props

    const editUrlBuilder = (propertyId, policyParams) => editOrDelete => {

      const property = this.props.properties.find( p => p.get('published_host_id') === propertyId )

      const propertyParams = {
        brand: this.props.params.brand,
        account: this.props.params.account,
        group: property.get('parentId')
      }
      return `${getContentUrl('propertyConfiguration', propertyId, propertyParams)}/policies/${getRoute('configurationTabPoliciesEditPolicy', { ...policyParams, editOrDelete })}`
    }

    if ( isFetching )
      return <LoadingSpinner />

    const tokenAuthRules = getTokenAuthRules( properties.toJS() )

    return (
          <TokenAuthList rules={tokenAuthRules} editUrlBuilder={editUrlBuilder}/>
    )

  }
}

TabTokenAuthentication.displayName = 'TabTokenAuthentication'

TabTokenAuthentication.propTypes = {
  fetchGroups: PropTypes.func,
  fetchProperties: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  isFetching: PropTypes.bool,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(List)
}

TabTokenAuthentication.defaultProps = {
  properties: List()
}

const mapStateToProps = (state, ownProps) => {
  const {params: {account, group} } = ownProps

  return {
    account: getById(state, account),
    groups: getGroupsByAccount(state, account),
    properties: group ? getPropertiesByGroup(state, group) : getPropetiesByAccount(state, account),
    isFetching: getFetchingByTag(state, REQUEST_TAG)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccount: (params) => dispatch( accountActions.fetchOne({...params, requestTag: REQUEST_TAG}) ),
    fetchGroups: (params) => dispatch( groupActions.fetchAll({...params, requestTag: REQUEST_TAG}) ),
    fetchProperties: (params) => dispatch( propertyActions.fetchAll({...params, requestTag: REQUEST_TAG} ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabTokenAuthentication)
