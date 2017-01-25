import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'

import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'

import { checkForErrors } from '../../../util/helpers'

const validate = ({ bgp_as_number, bgp_as_name, bgp_router_ip, bgp_password }) => {

  return checkForErrors(
    { bgp_as_number, bgp_as_name, bgp_router_ip, bgp_password },
    {},
    {
      bgp_as_number: <FormattedMessage values={{ field: 'BGP AS Number' }}
                                       id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_as_name: <FormattedMessage values={{ field: 'BGP AS Name' }}
                                     id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_router_ip: <FormattedMessage values={{ field: 'BGP Router IP' }}
                                       id="portal.network.spConfig.routingDaemon.editForm.required.text"/>,
      bgp_password: <FormattedMessage values={{ field: 'BGP Password' }}
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
      BGPNameNotFound: false
    }

    this.fetchBGPName = this.fetchBGPName.bind(this)
  }

  fetchBGPName(e) {
    const { fetchBGPName, setBGPName, intl } = this.props
    const BGPNumber = e.target.value

    if (!BGPNumber || this.state.BGPNumber === BGPNumber) {
      return;
    }

    // TODO: Remove me when this is actually connected to Redux
    this.setState({
      isFetchingBGPName: true
    })

    fetchBGPName(BGPNumber)
      .then(({ data: { holder } }) => {
        holder = holder ? holder : intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label' })
        this.setState({
          BGPNumber,
          BGPName: holder,
          BGPNameNotFound: false,
          isFetchingBGPName: false
        }, () => setBGPName(holder))

      })
      .catch(() => {
        this.setState({
          BGPNumber,
          BGPName: null,
          BGPNameNotFound: true,
          isFetchingBGPName: false
        }, () => setBGPName(intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label' })))
      })
  }

  render() {

    const {
      handleSubmit,
      intl,
      invalid,
      onCancel,
      submitting,
      onSubmit
    } = this.props

    const { BGPName, BGPNameNotFound, isFetchingBGPName } = this.state

    const BGB_AS_NUMBER_PROPS = {
      input: {
        onBlur: (e) => this.fetchBGPName(e)
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
          placeholder={isFetchingBGPName ? intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameFetching.label' }) : intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNamePlaceholder.label' })}
          disabled={!BGPName && !BGPNameNotFound}
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
            disabled={invalid || submitting || isFetchingBGPName}>
            <FormattedMessage id="portal.button.save"/>
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

RoutingDaemonForm.displayName = 'RoutingDaemonForm'
RoutingDaemonForm.propTypes = {
  fetchBGPName: PropTypes.func,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  setBGPName: PropTypes.func,
  submitting: PropTypes.bool
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBGPName: (name) => dispatch(change('routing-daemon-form', 'bgp_as_name', name))
  }
}


const form = reduxForm({
  form: 'routing-daemon-form',
  validate
})(RoutingDaemonForm)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
