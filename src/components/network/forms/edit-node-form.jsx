import React from 'react'

import {
  Button,
  FormGroup,
  Table
} from 'react-bootstrap'

import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import HelpPopover from '../../help-popover'
import ButtonDisableTooltip from '../../button-disable-tooltip'

import { checkForErrors } from '../../../util/helpers'

import {
  NODE_CLOUD_DRIVER_OPTIONS,
  NODE_ENVIRONMENT_OPTIONS,
  NODE_ROLE_OPTIONS,
  NODE_TYPE_OPTIONS
} from '../../../constants/network'

const multipleValuesText = <FormattedMessage id="portal.network.editNodeForm.multipleValues"/>

const isEmpty = function(value) {
  return !!value === false
}

const validate = function(values, props) {
  const { node_role, node_env, node_type, cloud_driver } = values
  const { nodes } = props
  const nodeValues = getNodeValues(nodes)

  // Nodes with multiple values have to be ignored as empty value is valid when you don't want to change the field in multiple nodes

  const conditions = {
    node_role: [
      {
        condition: nodeValues.hasOwnProperty('node_role') && nodeValues.node_role !== null && isEmpty(node_role),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.role.title" /> }}/>
      }
    ],
    node_env: [
      {
        condition: nodeValues.hasOwnProperty('node_env') && nodeValues.node_env !== null && isEmpty(node_env),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.environment.title" /> }}/>
      }
    ],
    node_type: [
      {
        condition: nodeValues.hasOwnProperty('node_type') && nodeValues.node_type !== null && isEmpty(node_type),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.type.title" /> }}/>
      }
    ],
    cloud_driver: [
      {
        condition: nodeValues.hasOwnProperty('cloud_driver') && nodeValues.cloud_driver !== null && isEmpty(cloud_driver),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.cloudDriver.title" /> }}/>
      }
    ]
  }

  return checkForErrors(values, conditions)
}

export const FORM_FIELDS = ['node_role', 'node_env', 'node_type', 'cloud_driver', 'custom_grains']

function getValueLabel(options, value) {
  if(!options || !options.length) {
    return value;
  }
  for (let i = 0, len = options.length; i < len; i++) {
    const option = options[i]
    if (option.value === value) {
      return option.label
    }
  }
  return value
}

/**
 * Get field values from nodes, if field has multiple values between nodes, indicate this with a null value
 * @param {Array} nodes
 * @returns {Object}
 */
export function getNodeValues(nodes) {
  if (!nodes) {
    return {}
  }

  const nodeValues = {}

  FORM_FIELDS.forEach(field => {
    nodeValues[field] = !hasMultipleValues(nodes, field) ? nodes[0][field] : null
  })
  return nodeValues
}

/**
 * Does the field have multiple values in edited nodes
 * @param {Array} nodes
 * @param {String} field
 * @returns {Boolean}
 */
export function hasMultipleValues(nodes, field) {
  if (!nodes || nodes.length === 1) {
    return false
  }
  const firstValue = nodes[0][field]
  return nodes.some(node => {
    return node[field] !== firstValue
  })
}


class NetworkEditNodeForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      expandedFields: {},
      hasMultipleNodes: this.props.nodes && this.props.nodes.length > 1,
      nodeValues: getNodeValues(this.props.nodes)
    }

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onSubmit() {
    // @TODO submit data
    this.props.onSave()
  }

  onCancel() {
    return this.props.onCancel()
  }

  onDelete() {
    return this.props.onDelete(true)
  }

  onToggleField(field) {
    const { expandedFields } = this.state
    if (expandedFields.hasOwnProperty(field)) {
      expandedFields[field] = !expandedFields[field]
    } else {
      expandedFields[field] = true
    }
    this.setState({
      expandedFields
    })
  }

  getFields() {
    const { nodes } = this.props
    const { hasMultipleNodes, expandedFields, nodeValues } = this.state
    const fields = [
      {
        name: 'node_role',
        className: 'input-select',
        component: FieldFormGroupSelect,
        options: NODE_ROLE_OPTIONS,
        labelId: 'portal.network.addNodeForm.role.title'
      },
      {
        name: 'node_env',
        className: 'input-select',
        component: FieldFormGroupSelect,
        options: NODE_ENVIRONMENT_OPTIONS,
        labelId: 'portal.network.addNodeForm.environment.title'
      },
      {
        name: 'node_type',
        className: 'input-select',
        component: FieldFormGroupSelect,
        options: NODE_TYPE_OPTIONS,
        labelId: 'portal.network.addNodeForm.type.title'
      },
      {
        name: 'cloud_driver',
        className: 'input-select',
        component: FieldFormGroupSelect,
        options: NODE_CLOUD_DRIVER_OPTIONS,
        labelId: 'portal.network.addNodeForm.cloudDriver.title'
      },
      {
        name: 'custom_grains',
        type: 'textarea',
        className: 'input-textarea',
        component: FieldFormGroup,
        labelId: 'portal.network.addNodeForm.grains.title'
      }
    ]

    return fields.map((fieldData, idx) => {
      let helpMessage = null
      let fieldToggle = null
      let isExpanded = true
      const fieldLabelText = <FormattedMessage id={fieldData.labelId} />
      const hasMultipleNodeValues = nodeValues.hasOwnProperty(fieldData.name) && nodeValues[fieldData.name] === null

      if (hasMultipleNodes && hasMultipleNodeValues) {
        isExpanded = expandedFields[fieldData.name] === true
        helpMessage = <FormattedMessage id="portal.network.editNodeForm.multipleValues.help"/>

        const linkTextId = isExpanded ? 'portal.common.button.cancel' : 'portal.common.button.edit'
        const helpPopoverId = 'edit-node-form__field-popover-' + fieldData.name

        const fieldNodeValues = nodes.map((node, nodeIndex) => {
          const field = node[fieldData.name]
          const valueLabel = getValueLabel(fieldData.options, field)
          return (<tr key={nodeIndex}><td>{node.id}</td><td>{valueLabel}</td></tr>)
        })

        fieldToggle = (
          <div className="edit-node-form__field-toggle">
            <HelpPopover id={helpPopoverId} buttonText={multipleValuesText} title={fieldLabelText} placement="left">
              <Table striped={true} condensed={true}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th><FormattedMessage id="portal.common.value"/></th>
                  </tr>
                </thead>
                <tbody>{fieldNodeValues}</tbody>
              </Table>
            </HelpPopover>
            <a className="pull-right" onClick={() => {
              this.onToggleField(fieldData.name)
            }}>
              <FormattedMessage id={linkTextId}/>
            </a>
          </div>
        )
      }

      return (
        <FormGroup key={idx}>
          <label>{fieldLabelText}</label>
          {fieldToggle}
          <div className={isExpanded ? 'show' : 'hidden'}>
            <Field {...fieldData} />
            {helpMessage && <div className="edit-node-form__field-help">{helpMessage}</div>}
          </div>
        </FormGroup>
      )
    })
  }

  render() {
    const {
      handleSubmit,
      invalid,
      nodes,
      pristine,
      submitting
    } = this.props

    const { hasMultipleNodes } = this.state


    let idValues = nodes[0].id
    let nameValues = nodes[0].name

    if (hasMultipleNodes) {
      if (hasMultipleValues(nodes, 'id')) {
        const idFieldValues = nodes.map((node, nodeIndex) => {
          return (<tr key={nodeIndex}><td>{node.id}</td></tr>)
        })

        idValues = (
          <HelpPopover id="edit-node-form__field-popover-id" buttonText={multipleValuesText} title="ID" placement="left">
            <Table striped={true} condensed={true}>
              <thead>
              <tr>
                <th>ID</th>
              </tr>
              </thead>
              <tbody>{idFieldValues}</tbody>
            </Table>
          </HelpPopover>
        )
      }
      if (hasMultipleValues(nodes, 'name')) {
        const nameFieldLabel = <FormattedMessage id="portal.common.name"/>
        const nameFieldValues = nodes.map((node, nodeIndex) => {
          return (<tr key={nodeIndex}><td>{node.id}</td><td>{node.name}</td></tr>)
        })

        nameValues = (
          <HelpPopover id="edit-node-form__field-popover-id" buttonText={multipleValuesText} title={nameFieldLabel} placement="left">
            <Table striped={true} condensed={true}>
              <thead>
              <tr>
                <th>ID</th>
                <th><FormattedMessage id="portal.common.value"/></th>
              </tr>
              </thead>
              <tbody>{nameFieldValues}</tbody>
            </Table>
          </HelpPopover>
        )
      }
    }

    const fields = this.getFields()

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.common.button.saving" />
      : <FormattedMessage id="portal.common.button.save" />

    return (
      <form className="edit-node-form" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="form-input-container">
          <span className='submit-error'>{this.props.error}</span>
          <FormGroup>
            <label>ID</label>
            <div className="input-group">{idValues}</div>
          </FormGroup>
          <FormGroup>
            <label>
              <FormattedMessage id="portal.common.name"/>
            </label>
            <div className="input-group">{nameValues}</div>
          </FormGroup>
          {fields}
        </div>
        <FormFooterButtons autoAlign={false}>
          <div className="pull-left">
            <ButtonDisableTooltip
              tooltipId="edit-node-form__delete-disabled-tooltip"
              bsStyle="danger"
              onClick={this.onDelete}
            >
              <FormattedMessage id="portal.common.button.delete" />
            </ButtonDisableTooltip>
          </div>
          <div className="pull-right">
            <Button
              id="edit-node-form__cancel-btn"
              className="btn-secondary"
              onClick={this.onCancel}>
              <FormattedMessage id="portal.common.button.cancel"/>
            </Button>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={pristine||invalid||submitting}>
              {submitButtonLabel}
            </Button>
          </div>
        </FormFooterButtons>
      </form>
    )
  }
}

export const FORM_NAME = 'networkEditNodeForm'

NetworkEditNodeForm.displayName = 'NetworkEditNodeForm'
NetworkEditNodeForm.propTypes = {
  intl: React.PropTypes.object,
  nodes: React.PropTypes.array.isRequired,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: FORM_NAME,
  validate
})(injectIntl(NetworkEditNodeForm))


