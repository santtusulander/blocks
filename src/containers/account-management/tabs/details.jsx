import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import { Map } from 'immutable'

import PageContainer from '../../../components/layout/page-container'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {getProviderTypes, getServices, getProviderTypeName, getOptionName, getServiceName} from '../../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'
import {fetchAccount, startFetching as accountStartFetching, getById as getAccountById, isFetching as accountsFetching} from '../../../redux/modules/account'

class AccountDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchServiceInfo()
    this.fetchData(this.props.params.brand, this.props.params.account)
  }

  componentWillReceiveProps(nextProps){
    if (this.props.params.account !== nextProps.params.account) {
      this.fetchData(nextProps.params.brand, nextProps.params.account)
    }
  }

  fetchData(brand, account){
    this.props.accountStartFetching();
    this.props.fetchAccountDetails(brand, account)
  }

  render() {
    const { providerTypes, services, account, accountIsFetching } = this.props

    return (
      <PageContainer className="account-management-account-details">
        { accountIsFetching
            ? <LoadingSpinner />
            : <div className='account-details'>
                <label><FormattedMessage id="portal.account.manage.brand.title"/></label>
                <span className='value'>UDN</span>

                <label>Account Name</label>
                <span className='value'>{account.get('name')}</span>

                <label><FormattedMessage id="portal.account.manage.accountType.text"/></label>
                <span className='value'>{ getProviderTypeName( providerTypes, account.get('provider_type') ) }</span>

                <label><FormattedMessage id="portal.account.manage.services.text"/></label>

                { /* List of Services (and options) */}
                <ul className='services-list'>
                  {
                    account && account.get('services') && account.get('services').map( (service,i) => {
                      const options = service.get('options')
                      let optionList;

                      if (options.size > 0) {
                        optionList = (
                          <ul>
                            {options.map( (optionId, i) => {
                              return <li key={i}>{getOptionName(services, service.get('id'), optionId)}</li>
                            })}
                          </ul>
                        );
                      }

                      return (
                        <li key={i}>
                          {getServiceName(services, service.get('id'))}
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
  services: PropTypes.instanceOf(Map)

}

AccountDetails.defaultProps = {
  account: Map(),
  providerTypes: Map(),
  services: Map()
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: getAccountById(state, ownProps.params.account),
    accountIsFetching: accountsFetching(state),
    providerTypes: getProviderTypes(state),
    services: getServices(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    accountStartFetching: () => dispatch( accountStartFetching() ),
    fetchAccountDetails: (brand, id) => dispatch( fetchAccount(brand, id) ),
    fetchServiceInfo: () => dispatch( serviceInfofetchAll() )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AccountDetails)
