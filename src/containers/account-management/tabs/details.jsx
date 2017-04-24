import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import { Map, List } from 'immutable'

import PageContainer from '../../../components/shared/layout/page-container'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {getProviderTypes, getServicesInfo, getProviderTypeName, getOptionName, getServiceName} from '../../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'
import {fetchAccount, startFetching as accountStartFetching, getById as getAccountById, isFetching as accountsFetching} from '../../../redux/modules/account'

import { getServicesIds } from '../../../util/services-helpers'

class AccountDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchServiceInfo()
    this.fetchData(this.props.params.brand, this.props.params.account)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.account !== nextProps.params.account) {
      this.fetchData(nextProps.params.brand, nextProps.params.account)
    }
  }

  fetchData(brand, account) {
    this.props.accountStartFetching();
    this.props.fetchAccountDetails(brand, account)
  }

  render() {
    const { providerTypes, servicesInfo, account, accountIsFetching } = this.props
    const servicesIds = account && account.get('services') ? getServicesIds(account.get('services')) : List()

    return (
      <PageContainer className="account-management-account-details">
        { accountIsFetching
            ? <LoadingSpinner />
            : <div className='account-details'>
                <label><FormattedMessage id="portal.account.manage.brand.title"/></label>
                <span className='value'><FormattedMessage id="portal.UDN.text"/></span>

                <label><FormattedMessage id="portal.account.manage.accountName.title" /></label>
                <span className='value'>{account.get('name')}</span>

                <label><FormattedMessage id="portal.account.manage.accountType.text"/></label>
                <span className='value'>{ getProviderTypeName(providerTypes, account.get('provider_type')) }</span>

                <label><FormattedMessage id="portal.account.manage.services.text"/></label>

                { /* List of Services (and options) */}
                <ul className='services-list'>
                  { servicesIds.isEmpty() &&
                    <li><FormattedMessage id="portal.account.manage.noServices.text"/></li>
                  }
                  {
                    !!servicesIds.size && servicesIds.map((service,i) => {
                      const options = service.get('options')
                      let optionList;

                      if (options.size > 0) {
                        optionList = (
                          <ul>
                            {options.map((optionId, optionIndex) => {
                              return <li key={optionIndex}>{getOptionName(servicesInfo, service.get('id'), optionId)}</li>
                            })}
                          </ul>
                        );
                      }

                      return (
                        <li key={i}>
                          {getServiceName(servicesInfo, service.get('id'))}
                          {optionList}
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
        }
      </PageContainer>
    )
  }
}

AccountDetails.displayName = 'AccountDetails'
AccountDetails.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountIsFetching: PropTypes.bool,
  accountStartFetching: PropTypes.func,
  fetchAccountDetails: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  params: PropTypes.object,
  providerTypes: PropTypes.instanceOf(Map),
  servicesInfo: PropTypes.instanceOf(Map)

}

AccountDetails.defaultProps = {
  account: Map(),
  providerTypes: Map(),
  servicesInfo: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  return {
    account: getAccountById(state, ownProps.params.account),
    accountIsFetching: accountsFetching(state),
    providerTypes: getProviderTypes(state),
    servicesInfo: getServicesInfo(state)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    accountStartFetching: () => dispatch(accountStartFetching()),
    fetchAccountDetails: (brand, id) => dispatch(fetchAccount(brand, id)),
    fetchServiceInfo: () => dispatch(serviceInfofetchAll())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AccountDetails)
