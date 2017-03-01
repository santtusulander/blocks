import React, { PropTypes } from 'react'
import { reduxForm, Field, change, propTypes as reduxFormPropTypes  } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import IsAllowed from '../../is-allowed'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'

import { checkForErrors } from '../../../util/helpers'
import { fetchASOverview } from '../../../util/network-helpers'
import { isValidTextField, isValidIP, isInt } from '../../../util/validators'
import { ROUTING_DEAMON_BGP_NAME_MIN_LEN, ROUTING_DEAMON_BGP_NAME_MAX_LEN } from '../../../constants/network'
import { MODIFY_POD } from '../../../constants/permissions'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

const validate = ({ bgp_as_name, bgp_router_ip }) => {
  const conditions = {
    bgp_router_ip: {
      condition: !isValidIP(bgp_router_ip),
      errorText: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.validation.text"/>
    },
    bgp_as_name: {
      condition: !isValidTextField(bgp_as_name, ROUTING_DEAMON_BGP_NAME_MIN_LEN, ROUTING_DEAMON_BGP_NAME_MAX_LEN),
      errorText: <MultilineTextFieldError id="portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label"
                                          minValue={ROUTING_DEAMON_BGP_NAME_MIN_LEN}
                                          maxValue={ROUTING_DEAMON_BGP_NAME_MAX_LEN} />
    }
  }

  return checkForErrors({ bgp_as_name, bgp_router_ip },
    conditions,
    {
      bgp_as_name: <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label" /> }}
                                     id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_router_ip: <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.label" /> }}
                                       id="portal.network.spConfig.routingDaemon.editForm.required.text"/>
    }
  )
}

class RoutingDaemonForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isFetchingBGPName: false,
      BGPNumber: null,
      BGPName: null,
      BGPNameNotFound: false,
      BGPNumberIsEmpty: null,
      BGPNumberInvalid: false
    }

    this.setBGPName = this.setBGPName.bind(this)
    this.fetchBGPName = this.fetchBGPName.bind(this)
  }

  componentWillMount() {
    const { initialValues: { bgp_as_number } } = this.props
    if (bgp_as_number) {
      this.fetchBGPName(bgp_as_number)
    }
  }

  setBGPName(name, BGPNumber) {
    this.props.dispatch(change('routing-daemon-form', 'bgp_as_name', name))
    this.props.dispatch(change('routing-daemon-form', 'bgp_as_number', BGPNumber))
  }

  fetchBGPName(value) {
    const BGPNumber = value

    if (!BGPNumber || BGPNumber.length == 0) {
      this.setState({ BGPNumberIsEmpty: true })
      return
    }

    if (!isInt(BGPNumber)) {
      this.setState({
        BGPNumberInvalid: true,
        BGPNameNotFound: false,
        BGPNumberIsEmpty: false
      })
      return
    } else {
      this.setState({
        BGPNumberInvalid: false,
        BGPNumberIsEmpty: false
      })
    }

    if (this.state.BGPNumber === BGPNumber) {
      return
    }

    this.setState({
      isFetchingBGPName: true
    })

    fetchASOverview(BGPNumber)
      .then(({ data: { holder } }) => {
        holder = holder ? holder : ''
        this.setState({
          BGPNumber,
          BGPName: holder.length ? holder : null,
          BGPNameNotFound: !holder.length,
          BGPNumberIsEmpty: false,
          isFetchingBGPName: false,
          BGPNumberInvalid: false
        }, () => this.setBGPName(holder, BGPNumber))
      })
      .catch(() => {
        this.setState({
          BGPNumber,
          BGPName: null,
          BGPNameNotFound: true,
          BGPNumberIsEmpty: false,
          isFetchingBGPName: false,
          BGPNumberInvalid: false
        }, () => this.setBGPName('', BGPNumber))
      })
  }

  render() {

    const {
      dirty,
      handleSubmit,
      intl,
      invalid,
      onCancel,
      onSubmit,
      submitting
    } = this.props

    const { BGPNameNotFound, BGPNumberInvalid, isFetchingBGPName, BGPNumberIsEmpty } = this.state

    let errorMsgASNum = ''
    if (BGPNumberIsEmpty) {
      errorMsgASNum = <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_number.required.text" />
    } else if (BGPNameNotFound) {
      errorMsgASNum = <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label" />
    } else if (BGPNumberInvalid) {
      errorMsgASNum = <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asIsNotAnNumber.text" />
    }

    const BGB_AS_NUMBER_PROPS = {
      meta: {
        invalid: !!errorMsgASNum,
        touched: !!errorMsgASNum,
        error: errorMsgASNum
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="sp-routing-daemon-form">

        <Field
          type="text"
          name="bgp_as_number"
          addonBefore={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.as.label' })}
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_number.label' })}
          placeholder={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_number.label' })}
          component={FieldFormGroup}
          onBlur={(e) => this.fetchBGPName(e.target.value)}
          props={BGB_AS_NUMBER_PROPS}
        />

        <Field
          type="text"
          name="bgp_as_name"
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label' })}
          placeholder={isFetchingBGPName ?
                        intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameFetching.label' }) :
                        intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNamePlaceholder.label' })}
          disabled={true}
          addonAfter={isFetchingBGPName ? <LoadingSpinnerSmall/> : ''}
          component={FieldFormGroup}
        />

        <Field
          type="text"
          name="bgp_router_ip"
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.label' })}
          placeholder={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.label' })}
          component={FieldFormGroup}
        />

        <Field
          required={false}
          type="password"
          name="bgp_password"
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_password.label' })}
          placeholder={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_password.label' })}
          component={FieldFormGroup}
        />

        <FormFooterButtons>
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <IsAllowed to={MODIFY_POD}>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={(invalid || submitting || isFetchingBGPName || (!dirty) || (!!errorMsgASNum))}>
              <FormattedMessage id="portal.button.save"/>
            </Button>
          </IsAllowed>
        </FormFooterButtons>
      </form>
    )
  }
}

RoutingDaemonForm.displayName = 'RoutingDaemonForm'
RoutingDaemonForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,

  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'routing-daemon-form',
  validate
})(injectIntl(RoutingDaemonForm))
