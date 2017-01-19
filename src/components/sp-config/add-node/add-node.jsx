import React from 'react'
import { connect } from 'react-redux'

import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel
} from 'react-bootstrap'

import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import { SidePanel, modalClassDim } from '../../side-panel'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

import { checkForErrors } from '../../../util/helpers'
import { isInt } from '../../../util/validators'

import {
  ROLE_OPTIONS,
  ENVIRONMENT_OPTIONS,
  TYPE_OPTIONS,
  CLOUD_DRIVER_OPTIONS
} from '../../../constants/sp-config-options'

const isEmpty = function(value) {
  return !!value === false
}

const validate = ({ numNodes, node_role, node_env, node_type, cloud_driver }) => {
  const conditions = {
    numNodes: [
      {
        condition: isEmpty(numNodes),
        errorText: <FormattedMessage id="portal.validators.required" values={ {field: <FormattedMessage id="portal.spConfig.addNode.howMany.title" /> } }/>
      },
      {
        condition: isInt(numNodes) === false || numNodes < 1,
        errorText: <FormattedMessage id="portal.validators.type.number" values={ {field : <FormattedMessage id="portal.spConfig.addNode.howMany.title" /> } }/>
      }
    ],
    node_role: [
      {
        condition: isEmpty(node_role),
        errorText: <FormattedMessage id="portal.validators.required" values={ {field: <FormattedMessage id="portal.spConfig.addNode.role.title" /> } }/>
      }
    ],
    node_env: [
      {
        condition: isEmpty(node_env),
        errorText: <FormattedMessage id="portal.validators.required" values={ {field: <FormattedMessage id="portal.spConfig.addNode.environment.title" /> } }/>
      }
    ],
    node_type: [
      {
        condition: isEmpty(node_type),
        errorText: <FormattedMessage id="portal.validators.required" values={ {field: <FormattedMessage id="portal.spConfig.addNode.type.title" /> } }/>
      }
    ],
    cloud_driver: [
      {
        condition: isEmpty(cloud_driver),
        errorText: <FormattedMessage id="portal.validators.required" values={ {field: <FormattedMessage id="portal.spConfig.addNode.cloudDriver.title" /> } }/>
      }
    ]
  }

  return checkForErrors({ numNodes, node_role, node_env, node_type, cloud_driver }, conditions)
}

class AddNodeForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showAddConfirmation: false
    }

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
    this.onCancelConfirm = this.onCancelConfirm.bind(this)
  }

  onSubmit() {
    // @TODO submit data
    this.props.onSave()
  }

  onCancel(){
    return this.props.onCancel()
  }

  onConfirm(event) {
    event.preventDefault()
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
      const confirmText = <FormattedMessage id="portal.spConfig.addNode.confirmAdd" values={ {numNodes} }/>
      return <FormFooterButtons autoAlign={false}>
        <div className="modal-footer__text">{confirmText}</div>
        <ButtonToolbar className="pull-right">
          <Button
            id="cancel-btn"
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
      </FormFooterButtons>
    } else {
      return <FormFooterButtons>
        <Button
          id="cancel-btn"
          className="btn-secondary"
          onClick={this.onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button
          bsStyle="primary"
          onClick={this.onConfirm}
          disabled={invalid||submitting}>
          <FormattedMessage id="portal.button.add" />
        </Button>
      </FormFooterButtons>
    }
  }

  render() {
    const {
      handleSubmit,
      show
    } = this.props

    const { showAddConfirmation } = this.state

    const panelTitle = <FormattedMessage id="portal.spConfig.addNode.title" />
    const panelSubTitle = ['Group X', 'Network Y', 'POP 1 - Chicago', 'POD2'].join(' / ') // @TODO add real values when redux connected

    const footerButtons = this.getFooterButtons()

    return (
      <SidePanel
        show={show}
        title={panelTitle}
        subTitle={panelSubTitle}
        cancel={this.onCancel}
        className={ showAddConfirmation ? modalClassDim : '' }
      >
        <form className="add-node__form" onSubmit={handleSubmit(this.onSubmit)}>
          <div className="form-input-container">
            <span className='submit-error'>{this.props.error}</span>
            <FormGroup>
              <Field
                type="number"
                name="numNodes"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.spConfig.addNode.howMany.title" />}
              />
            </FormGroup>
            <FormGroup>
              <Field
                name="node_role"
                className="input-select"
                component={FieldFormGroupSelect}
                options={ ROLE_OPTIONS }
                label={<FormattedMessage id="portal.spConfig.addNode.role.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="node_env"
                className="input-select"
                component={FieldFormGroupSelect}
                options={ ENVIRONMENT_OPTIONS }
                label={<FormattedMessage id="portal.spConfig.addNode.environment.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="node_type"
                className="input-select"
                component={FieldFormGroupSelect}
                options={ TYPE_OPTIONS }
                label={<FormattedMessage id="portal.spConfig.addNode.type.title" />}
              />
            </FormGroup>

            <FormGroup>
              <Field
                name="cloud_driver"
                className="input-select"
                component={FieldFormGroupSelect}
                options={ CLOUD_DRIVER_OPTIONS }
                label={<FormattedMessage id="portal.spConfig.addNode.cloudDriver.title" />}
              />
            </FormGroup>
          </div>
          {footerButtons}
        </form>
      </SidePanel>
    )
  }
}

const FORM_NAME = 'addNodeForm'

AddNodeForm.displayName = 'AddNode'
AddNodeForm.propTypes = {
  cancelChanges: React.PropTypes.func,
  createNode: React.PropTypes.func,
  intl: React.PropTypes.object,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: FORM_NAME,
  validate
})(AddNodeForm)

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
const mapDispatchToProps = dispatch => {
  return {} // @TODO connect to Redux
}

export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(form))
