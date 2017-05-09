import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import {FormattedMessage} from 'react-intl'

import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { Map, List, fromJS } from 'immutable'

import SectionContainer from '../../../components/shared/layout/section-container'
import propertiesActions from '../../../redux/modules/entities/properties/actions'
import { getIdsByGroup as getPropertiesbyGroup } from '../../../redux/modules/entities/properties/selectors'

import FieldFormGroupSelect from '../../../components/shared/form-fields/field-form-group-select'


// import {getProviderTypes, getServicesInfo, getProviderTypeName, getOptionName, getServiceName} from '../../../redux/modules/service-info/selectors'
// import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'
// import {fetchAccount, startFetching as accountStartFetching, getById as getAccountById, isFetching as accountsFetching} from '../../../redux/modules/account'

// import { getServicesIds } from '../../../util/services-helpers'

class ServicesLogDelivery extends React.Component {
  constructor(props) {
    super(props)
  }

  // componentWillMount() {
  //   this.props.fetchServiceInfo()
  //   this.fetchData(this.props.params.brand, this.props.params.account)
  // }

  componentWillMount() {
    this.props.fetchProperties(this.props.params)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.params.account !== nextProps.params.account) {
  //     this.fetchData(nextProps.params.brand, nextProps.params.account)
  //   }
  // }

  // fetchData(brand, account) {
  //   this.props.accountStartFetching();
  //   this.props.fetchAccountDetails(brand, account)
  // }

  render() {
    // const { providerTypes, servicesInfo, account, accountIsFetching } = this.props
    // const servicesIds = account && account.get('services') ? getServicesIds(account.get('services')) : List()
    // const options = [
    //   {label: 'Prop1', value: 'prop1'},
    //   {label: 'Prop2', value: 'prop1'},
    //   {label: 'Prop3', value: 'prop1'},
    // ]

    const properties = this.props.propertyIds.toJS().map((host) => ({label: host, value: host}))


    return (
      <form className="log-delivery">
        <SectionContainer>
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.cdnName.label"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                <Field
                  name="property"
                  component={FieldFormGroupSelect}
                  options={properties}
                />

              </Col>
            </FormGroup>
          </Row>
        </SectionContainer>
      </form>
    )
  }
}

ServicesLogDelivery.displayName = 'ServicesLogDelivery'
ServicesLogDelivery.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountIsFetching: PropTypes.bool,
  accountStartFetching: PropTypes.func,
  fetchAccountDetails: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  params: PropTypes.object,
  providerTypes: PropTypes.instanceOf(Map),
  servicesInfo: PropTypes.instanceOf(Map),
  ...reduxFormPropTypes
}

// ServicesLogDelivery.defaultProps = {
//   account: Map(),
//   providerTypes: Map(),
//   servicesInfo: Map()
// }

/* istanbul ignore next */
const mapStateToProps = (state, {params: {group}}) => {
  return {
    propertyIds: getPropertiesbyGroup(state, group)
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchProperties: (params) => dispatch(propertiesActions.fetchAll(params))
  }
}

// /* istanbul ignore next */
// const mapStateToProps = (state, ownProps) => {
//   return {
//     account: getAccountById(state, ownProps.params.account),
//     accountIsFetching: accountsFetching(state),
//     providerTypes: getProviderTypes(state),
//     servicesInfo: getServicesInfo(state)
//   }
// }

// /* istanbul ignore next */
// const mapDispatchToProps = (dispatch) => {
//   return {
//     accountStartFetching: () => dispatch(accountStartFetching()),
//     fetchAccountDetails: (brand, id) => dispatch(fetchAccount(brand, id)),
//     fetchServiceInfo: () => dispatch(serviceInfofetchAll())
//   }
// }

const LogDeliveryForm = reduxForm({
  form: 'logDeliveryForm'
  // enableReinitialize: true,
  // validate
})(ServicesLogDelivery)

export default connect(mapStateToProps, dispatchToProps)(LogDeliveryForm)
