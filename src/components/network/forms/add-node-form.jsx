import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { change, Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import DefaultErrorBlock from '../../form/default-error-block'
import FieldFormGroup from '../../form/field-form-group'
//import FieldFormGroupNumber from '../../form/field-form-group-number'
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
  }

  componentWillReceiveProps(nextProps){

    const {nodeNameData} = nextProps
    const nodeNameProps = nodeNameData.props
    if (
      nextProps.nodeNameData.props.cacheEnv !== this.props.nodeNameData.props.cacheEnv
      || nextProps.nodeNameData.props.nodeType !== this.props.nodeNameData.props.nodeType
    ) {
      this.props.dispatch( change(ADD_NODE_FORM_NAME, 'node_name', `${nodeNameProps.nodeType}${nodeNameProps.nameCode}.${nodeNameProps.location}.${nodeNameProps.cacheEnv}.${nodeNameProps.domain}`))
    }

  }

  onSubmit(values) {
    const { numNodes } = this.props
    const { showAddConfirmation } = this.state
    if (!showAddConfirmation && numNodes > 1) {
      this.toggleAddConfirm(true)
      return
    }

    const finalValues = {...values}
    return this.props.onSave(finalValues)
      .catch(error => {
        this.toggleAddConfirm(false)
        throw error
      })
  }

  onCancel() {
    return this.props.onCancel()
  }

  toggleAddConfirm(showAddConfirmation) {
    this.setState({ showAddConfirmation })
    this.props.onToggleConfirm(showAddConfirmation)
  }

  getFooterButtons() {
    const { invalid, submitting, numNodes } = this.props
    const { showAddConfirmation } = this.state

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.button.adding" />
      : <FormattedMessage id="portal.button.yes" />

    if (showAddConfirmation) {
      const confirmText = <FormattedMessage id="portal.network.addNodeForm.confirmAdd" values={{numNodes}}/>
      return (<FormFooterButtons>
        <div className="modal-footer__text">{confirmText}</div>
        <ButtonToolbar className="pull-right">
          <Button
            id="cancel-confirm-btn"
            className="btn-secondary"
            onClick={() => this.toggleAddConfirm(false)}>
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
    const { handleSubmit, nodeNameData, error } = this.props
    const footerButtons = this.getFooterButtons()
    const nodeNameProps = nodeNameData.props

    return (
      <form className="sp-add-node-form" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="form-input-container">
          {error && <DefaultErrorBlock error={error}/>}
          {/* <Row>
            <Col sm={3}>
              <Field
                type="number"
                name="numNodes"
                min={1}
                component={FieldFormGroupNumber}
                label={<FormattedMessage id="portal.network.addNodeForm.howMany.title" />}
              />
            </Col>
          </Row> */}

          { /* Commented out because of UDNP-2780 - maybe needed in future
          <label><FormattedMessage id="portal.common.name" /></label>
          */}
          <div className="add-node-form__name-fqdn">
            {nodeNameProps.nodeType}<span className="sp-add-node-form__highlight-name">{nodeNameProps.nameCode}</span>.{nodeNameProps.location}.{nodeNameProps.cacheEnv}.{nodeNameProps.domain}
          </div>

          {/*
          <Field
            type="number"
            name="nameCode"
            min={0}
            max={99}
            component={FieldFormGroupNumber}
          />
          */}

          <Field
            type='text'
            name='node_name'
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.common.name" />}
          />

          <Field
            name="node_role"
            className="input-select"
            component={FieldFormGroupSelect}
            options={NODE_ROLE_OPTIONS}
            label={<FormattedMessage id="portal.network.addNodeForm.role.title" />}
          />

          <Field
            name="node_env"
            className="input-select"
            component={FieldFormGroupSelect}
            options={NODE_ENVIRONMENT_OPTIONS}
            label={<FormattedMessage id="portal.network.addNodeForm.environment.title" />}
          />

          <Field
            name="node_type"
            className="input-select"
            component={FieldFormGroupSelect}
            options={NODE_TYPE_OPTIONS}
            label={<FormattedMessage id="portal.network.addNodeForm.type.title" />}
          />

          <Field
            name="cloud_driver"
            className="input-select"
            component={FieldFormGroupSelect}
            options={NODE_CLOUD_DRIVER_OPTIONS}
            label={<FormattedMessage id="portal.network.addNodeForm.cloudDriver.title" />}
          />

          <Field
            name="custom_grains"
            type="textarea"
            disabled={true}
            className="input-textarea"
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.network.addNodeForm.grains.title" />}
          />
        </div>
        {footerButtons}
      </form>
    )
  }
}

NetworkAddNodeForm.displayName = 'NetworkAddNodeForm'
NetworkAddNodeForm.propTypes = {
  initialValues: React.PropTypes.object,
  intl: intlShape.isRequired,
  nodeNameData: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  onToggleConfirm: React.PropTypes.func,
  ...reduxFormPropTypes
}

export const ADD_NODE_FORM_NAME = 'networkAddNodeForm'
export default reduxForm({
  form: ADD_NODE_FORM_NAME,
  validate
})(injectIntl(NetworkAddNodeForm))
