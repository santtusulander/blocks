import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'

import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'

import { checkForErrors } from '../../../util/helpers'
import { fetchASOverview } from '../../../util/network-helpers'
import { isValidTextField, isValidIPv4Address } from '../../../util/validators'
import { ROUTING_DEAMON_PASSWORD_MIN_LEN, ROUTING_DEAMON_PASSWORD_MAX_LEN,
         ROUTING_DEAMON_BGP_NAME_MIN_LEN, ROUTING_DEAMON_BGP_NAME_MAX_LEN
       } from '../../../constants/network'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

const validate = ({ bgp_as_name, bgp_router_ip, bgp_password }) => {
  const conditions = {
    bgp_router_ip: {
      condition: !isValidIPv4Address(bgp_router_ip),
      errorText: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.validation.text"/>
    },
    bgp_as_name: {
      condition: !isValidTextField(bgp_as_name, ROUTING_DEAMON_BGP_NAME_MIN_LEN, ROUTING_DEAMON_BGP_NAME_MAX_LEN),
      errorText: <MultilineTextFieldError id="portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label"
                                          minValue={ROUTING_DEAMON_BGP_NAME_MIN_LEN}
                                          maxValue={ROUTING_DEAMON_BGP_NAME_MAX_LEN} />
    },
    bgp_password: {
      condition: !isValidTextField(bgp_password, ROUTING_DEAMON_PASSWORD_MIN_LEN, ROUTING_DEAMON_PASSWORD_MAX_LEN),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.spConfig.routingDaemon.editForm.bgp_password.label"
                                          minValue={ROUTING_DEAMON_PASSWORD_MIN_LEN}
                                          maxValue={ROUTING_DEAMON_PASSWORD_MAX_LEN} />
    }
  }

  return checkForErrors({ bgp_as_name, bgp_router_ip, bgp_password },
    conditions,
    {
      bgp_as_name: <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label" /> }}
                                     id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_router_ip: <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.label" /> }}
                                       id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_password: <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_password.label" /> }}
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
      BGPNumberIsEmpty: null
    }

    this.fetchBGPName = this.fetchBGPName.bind(this)
  }

  fetchBGPName(e) {
    const { setBGPName } = this.props
    const BGPNumber = e.target.value

    if (!BGPNumber && BGPNumber.length == 0) {
      this.setState({ BGPNumberIsEmpty: true })
    }

    if (this.state.BGPNumber === BGPNumber) {
      return;
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
          isFetchingBGPName: false
        }, () => setBGPName(holder, BGPNumber))
      })
      .catch(() => {
        this.setState({
          BGPNumber,
          BGPName: null,
          BGPNameNotFound: true,
          BGPNumberIsEmpty: false,
          isFetchingBGPName: false
        }, () => setBGPName('', BGPNumber))
      })
  }

  render() {

    const {
      dirty,
      handleSubmit,
      initialValues,
      intl,
      invalid,
      onCancel,
      onSubmit,
      submitting
    } = this.props

    const { BGPName, BGPNameNotFound, isFetchingBGPName, BGPNumberIsEmpty } = this.state

    const errorMsgASNum = BGPNumberIsEmpty ? <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_number.required.text" />
                                           : (BGPNameNotFound
                                           ? <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/> : '')

    const BGB_AS_NUMBER_PROPS = {
      input: {
        onBlur: (e) => this.fetchBGPName(e),
        // TODO: Nej funkar prkl.
        // onChange: ({ target: { value } }) => initialValues.bgp_as_number = value,
        // value: initialValues.bgp_as_number
      },
      meta: {
        invalid: BGPNameNotFound,
        touched: BGPNameNotFound,
        error: errorMsgASNum
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="routing-daemon__form">

        <Field
          type="text"
          name="bgp_as_number"
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_number.label' })}
          placeholder={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_number.label' })}
          component={FieldFormGroup}
          props={BGB_AS_NUMBER_PROPS}
        />

        <Field
          type="text"
          name="bgp_as_name"
          label={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label' })}
          placeholder={isFetchingBGPName ?
                        intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameFetching.label' }) :
                        intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNamePlaceholder.label' })}
          disabled={!BGPName && BGPNameNotFound}
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

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting || isFetchingBGPName || (!dirty)}>
            <FormattedMessage id="portal.button.save"/>
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

RoutingDaemonForm.displayName = 'RoutingDaemonForm'
RoutingDaemonForm.propTypes = {
  dirty: PropTypes.bool,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  setBGPName: PropTypes.func,
  submitting: PropTypes.bool
}


const mapStateToProps = (state) => {
  const podValues = state.form['pod-form'].initial
  const initialValues = {
    bgp_as_number: podValues.UIsp_bgp_router_as,
    bgp_router_ip: podValues.UIsp_bgp_router_ip,
    bgp_password: podValues.UIsp_bgp_router_password
  }

  return {
    initialValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBGPName: (name, BGPNumber) => {
      dispatch(change('routing-daemon-form', 'bgp_as_name', name))
      dispatch(change('routing-daemon-form', 'bgp_as_number', BGPNumber))
    }
  }
}


const form = reduxForm({
  form: 'routing-daemon-form',
  validate
})(RoutingDaemonForm)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
