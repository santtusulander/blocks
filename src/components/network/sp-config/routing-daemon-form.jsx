import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'react-bootstrap'

import SidePanel from '../../side-panel'
import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'

const errors = {}

const validate = (values) => {

  const { bgp_as_number, bgp_as_name, bgp_router_ip, bgp_password } = values

  if (!bgp_as_number) {
    errors.bgp_as_number = <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_number.label"/> }} id="portal.network.spConfig.routingDaemon.editForm.required.text"/>
  }

  if (!bgp_as_name) {
    errors.bgp_as_name = <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_as_name.label"/> }} id="portal.network.spConfig.routingDaemon.editForm.required.text"/>
  }

  if (!bgp_router_ip) {
    errors.bgp_router_ip = <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_router_ip.label"/> }} id="portal.network.spConfig.routingDaemon.editForm.required.text"/>
  }

  if (!bgp_password) {
    errors.bgp_password = <FormattedMessage values={{ field: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.bgp_password.label"/> }} id="portal.network.spConfig.routingDaemon.editForm.required.text"/>
  }

  return errors
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
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props

    onSave(values)
  }

  fetchBGPName(e) {
    const { fetchBGPName, setBGPName } = this.props
    const { BGPName } = this.state
    const BGPNumber = e.target.value

    if (!BGPNumber || this.state.BGPNumber === BGPNumber) {
      return;
    }

    // TODO: Remove me when this is actually connected to Redux
    this.setState({
      isFetchingBGPName: true
    })

    fetchBGPName()
      .then(res => {
        this.setState({
          BGPNumber,
          BGPName: res.payload,
          BGPNameNotFound: false,
          isFetchingBGPName: false
        }, () => setBGPName(res.payload))

      })
      .catch(() => {
        this.setState({
          BGPNumber,
          BGPName: null,
          BGPNameNotFound: true,
          isFetchingBGPName: false
        }, () => setBGPName(this.props.intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.asNameNotFound' })))
      })
  }

  render() {
    const {
      handleSubmit,
      intl,
      invalid,
      onCancel,
      show,
      submitting,
      editing
    } = this.props

    const { BGPName, BGPNameNotFound, isFetchingBGPName } = this.state

    const formTitle = editing ? 'portal.network.spConfig.routingDaemon.editForm.title' : 'portal.network.spConfig.routingDaemon.addForm.title'

    const BGB_AS_NUMBER_PROPS = {
      input: {
        onBlur: (e) => this.fetchBGPName(e)
      }
    }

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: formTitle })}
        cancel={onCancel}
      >
        <form onSubmit={handleSubmit(this.onSubmit)}>

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
            addonAfter={isFetchingBGPName ? 'spin' : ''}
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
      </SidePanel>
    )
  }
}

RoutingDaemonForm.displayName = 'RoutingDaemonForm'
RoutingDaemonForm.propTypes = {
  editing: PropTypes.bool,
  fetchBGPName: PropTypes.func,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  setBGPName: PropTypes.func,
  show: PropTypes.bool,
  submitting: PropTypes.bool
}

const mapStateToProps = (state) => {
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
