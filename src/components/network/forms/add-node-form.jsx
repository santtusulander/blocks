import React from 'react'
import { connect } from 'react-redux'

import {
  Button,
  ButtonToolbar,
  FormGroup
} from 'react-bootstrap'

import { Field, formValueSelector, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import SidePanel from '../../side-panel'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

import { checkForErrors } from '../../../util/helpers'
import { isInt } from '../../../util/validators'

import {
  NODE_CLOUD_DRIVER_OPTIONS,
  NODE_ENVIRONMENT_OPTIONS,
  NODE_ROLE_OPTIONS,
  NODE_TYPE_OPTIONS
} from '../../../constants/network'

const isEmpty = function(value) {
  return !!value === false
}

const validate = ({ numNodes, node_role, node_env, node_type, cloud_driver }) => {
  const conditions = {
    numNodes: [
      {
        condition: isEmpty(numNodes),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.howMany.title" /> }}/>
      },
      {
        condition: isInt(numNodes) === false || numNodes < 1,
        errorText: <FormattedMessage id="portal.validators.type.number" values={{field : <FormattedMessage id="portal.network.addNodeForm.howMany.title" /> }}/>
      }
    ],
    node_role: [
      {
        condition: isEmpty(node_role),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.role.title" /> }}/>
      }
    ],
    node_env: [
      {
        condition: isEmpty(node_env),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.environment.title" /> }}/>
      }
    ],
    node_type: [
      {
        condition: isEmpty(node_type),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.type.title" /> }}/>
      }
    ],
    cloud_driver: [
      {
        condition: isEmpty(cloud_driver),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.cloudDriver.title" /> }}/>
      }
    ]
  }

  return checkForErrors({ numNodes, node_role, node_env, node_type, cloud_driver }, conditions)
}

class NetworkAddNodeForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showAddConfirmation: false
    }

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancelConfirm = this.onCancelConfirm.bind(this)
  }

  onSubmit() {
    const { showAddConfirmation } = this.state
    if (!showAddConfirmation) {
      this.showConfirm();
      return
    }
    // @TODO submit data
    this.props.onSave()
  }

  onCancel(){
    return this.props.onCancel()
  }

  showConfirm() {
    this.setState({ showAddConfirmation: true })
  }

  onCancelConfirm() {
    this.setState({ showAddConfirmation: false })
  }

  getFooterButtons() {
    const { invalid, submitting, numNodes } = this.props
    const { showAddConfirmation } = this.state

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.button.adding" />
      : <FormattedMessage id="portal.button.yes" />

    if (showAddConfirmation) {
      const confirmText = <FormattedMessage id="portal.network.addNodeForm.confirmAdd" values={{numNodes}}/>
      return (<FormFooterButtons autoAlign={false}>
        <div className="modal-footer__text">{confirmText}</div>
        <ButtonToolbar className="pull-right">
          <Button
            id="cancel-confirm-btn"
            className="btn-secondary"
            onClick={this.onCancelConfirm}>
            <FormattedMessage id="portal.button.back"/>
          </Button>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid||submitting}>
            {submitButtonLabel}
          </Button>
        </ButtonToolbar>
      </FormFooterButtons>)
    } else {
      return (<FormFooterButtons>
        <Button
          id="cancel-btn"
          className="btn-secondary"
          onClick={this.onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button
          type="submit"
          bsStyle="primary"
          disabled={invalid||submitting}>
          <FormattedMessage id="portal.button.add" />
        </Button>
      </FormFooterButtons>)
    }
  }

  render() {
    const {
      handleSubmit,
      show
    } = this.props

    const { showAddConfirmation } = this.state

    const panelTitle = <FormattedMessage id="portal.network.addNodeForm.title" />
    const panelSubTitle = ['Group X', 'Network Y', 'POP 1 - Chicago', 'POD2'].join(' / ') // @TODO add real values when redux connected

    const footerButtons = this.getFooterButtons()

    return (
      <SidePanel
        show={show}
        title={panelTitle}
        subTitle={panelSubTitle}
        cancel={this.onCancel}
        dim={showAddConfirmation}
      >
        <form className="add-node__form" onSubmit={handleSubmit(this.onSubmit)}>
          <div className="form-input-container">
            <span className='submit-error'>{this.props.error}</span>
            <FormGroup>
              <Field
                type="number"
                name="numNodes"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.network.addNodeForm.howMany.title" />}
              />
            </FormGroup>
            <FormGroup>
              <Field
                name="node_role"
                className="input-select"
                component={FieldFormGroupSelect}
                options={NODE_ROLE_OPTIONS}
                label={<FormattedMessage id="portal.network.addNodeForm.role.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="node_env"
                className="input-select"
                component={FieldFormGroupSelect}
                options={NODE_ENVIRONMENT_OPTIONS}
                label={<FormattedMessage id="portal.network.addNodeForm.environment.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="node_type"
                className="input-select"
                component={FieldFormGroupSelect}
                options={NODE_TYPE_OPTIONS}
                label={<FormattedMessage id="portal.network.addNodeForm.type.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="cloud_driver"
                className="input-select"
                component={FieldFormGroupSelect}
                options={NODE_CLOUD_DRIVER_OPTIONS}
                label={<FormattedMessage id="portal.network.addNodeForm.cloudDriver.title" />}
              />
            </FormGroup>
          </div>
          {footerButtons}
        </form>
      </SidePanel>
    )
  }
}

const FORM_NAME = 'networkAddNodeForm'

NetworkAddNodeForm.displayName = 'NetworkAddNodeForm'
NetworkAddNodeForm.propTypes = {
  intl: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: FORM_NAME,
  validate
})(NetworkAddNodeForm)

const formSelector = formValueSelector(FORM_NAME)

const mapStateToProps = (state) => {
  const numNodes = formSelector(state, 'numNodes') || 1
  const nodeRole = formSelector(state, 'node_role') || 'cache'
  const nodeEnv = formSelector(state, 'node_env') || 'production'
  const nodeType = formSelector(state, 'node_type')
  const cloudDriver = formSelector(state, 'cloud_driver')
  return {
    numNodes,
    initialValues: {
      numNodes,
      node_role: nodeRole,
      node_env: nodeEnv,
      node_type: nodeType,
      cloud_driver: cloudDriver
    }
  }
}
const mapDispatchToProps = () => {
  return {} // @TODO connect to Redux
}

export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(form))
