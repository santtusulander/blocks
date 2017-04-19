import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import propertyActions from '../../../redux/modules/entities/properties/actions'
import { getByGroup as getPropertiesByGroup } from '../../../redux/modules/entities/properties/selectors'

import { getTokenAuthRules } from '../../../util/policy-config'
import { getContentUrl, getRoute } from '../../../util/routes'

import { getFetchingByTag } from '../../../redux/modules/fetching//selectors'

import TokenAuthList from '../../../components/security/token-auth-list'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

const REQUEST_TAG = 'req-token-auth'

class TabTokenAuthentication extends Component {
  componentWillMount() {
    const { brand, account, group } = this.props.params
    if (group) {
      this.fetchData(brand, account, group)
    }
  }

  fetchData(brand, account, group) {
    this.props.fetchProperties({ brand, account, group })
  }

  render() {
    const {properties, isFetching} = this.props

    const editUrlBuilder = (propertyId, policyParams) => editOrDelete => {

      const property = this.props.properties.find(p => p.get('published_host_id') === propertyId)

      const propertyParams = {
        brand: this.props.params.brand,
        account: this.props.params.account,
        group: property.get('parentId')
      }
      return `${getContentUrl('propertyConfiguration', propertyId, propertyParams)}/policies/${getRoute('configurationTabPoliciesEditPolicy', { ...policyParams, editOrDelete })}`
    }

    if (isFetching) {
      return <LoadingSpinner />
    }

    const tokenAuthRules = getTokenAuthRules(properties.toJS())

    return (
      !this.props.params.group
        ?
          <p className='text-center'>
            <FormattedMessage id='portal.security.tokenAuth.selectGroup.text' />
          </p>
        :
          <TokenAuthList rules={tokenAuthRules} editUrlBuilder={editUrlBuilder}/>
    )

  }
}

TabTokenAuthentication.displayName = 'TabTokenAuthentication'

TabTokenAuthentication.propTypes = {
  fetchProperties: PropTypes.func,
  isFetching: PropTypes.bool,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(List)
}

TabTokenAuthentication.defaultProps = {
  properties: List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => (
  {
    properties: getPropertiesByGroup(state, ownProps.params.group),
    isFetching: getFetchingByTag(state, REQUEST_TAG)
  }
)

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => (
  {
    fetchProperties: (params) => dispatch(propertyActions.fetchAll({...params, requestTag: REQUEST_TAG, forceReload: true}))
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(TabTokenAuthentication)
