import React from 'react'

import {
  Button,
  FormGroup,
  Table
} from 'react-bootstrap'

import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import DefaultErrorBlock from '../../shared/form-elements/default-error-block'
import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import HelpPopover from '../../shared/tooltips/help-popover'
import ButtonDisableTooltip from '../../shared/tooltips/button-disable-tooltip'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'
import HelpTooltip from '../../shared/tooltips/help-tooltip'

import { checkForErrors } from '../../../util/helpers'
import classNames from 'classnames'

import { MODIFY_NODE, DELETE_NODE } from '../../../constants/permissions'
import {
  NODE_CLOUD_DRIVER_OPTIONS,
  NODE_ENVIRONMENT_OPTIONS,
  NODE_ROLE_OPTIONS,
  NODE_TYPE_OPTIONS,
  STATUS_OPTIONS
} from '../../../constants/network'

export const MULTIPLE_VALUE_INDICATOR = 'FIELD_HAS_MULTIPLE_VALUES'
export const FORM_FIELDS = ['status', 'roles', 'env', 'type', 'cloud_driver', 'custom_grains']

const multipleValuesText = <FormattedMessage id="portal.network.editNodeForm.multipleValues"/>

const isEmpty = function(value) {
  return !!value === false
}

const validate = function({ custom_grains, ...values }, props) {
  const { node_role, node_env, node_type, cloud_driver } = values
  const { nodeValues } = props

  // Nodes with multiple values have to be ignored as empty value is valid when you don't want to change the field in multiple nodes

  const conditions = {
    node_role: [
      {
        condition: nodeValues.node_role !== MULTIPLE_VALUE_INDICATOR && isEmpty(node_role),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.role.title" /> }}/>
      }
    ],
    node_env: [
      {
        condition: nodeValues.node_env !== MULTIPLE_VALUE_INDICATOR && isEmpty(node_env),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.environment.title" /> }}/>
      }
    ],
    node_type: [
      {
        condition: nodeValues.node_type !== MULTIPLE_VALUE_INDICATOR && isEmpty(node_type),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.type.title" /> }}/>
      }
    ],
    cloud_driver: [
      {
        condition: nodeValues.cloud_driver !== MULTIPLE_VALUE_INDICATOR && isEmpty(cloud_driver),
        errorText: <FormattedMessage id="portal.validators.required" values={{field: <FormattedMessage id="portal.network.addNodeForm.cloudDriver.title" /> }}/>
      }
    ]
  }

  return checkForErrors(values, conditions)
}



function getValueLabel(options, value) {
  if (!options || !options.length) {
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
    nodeValues[field] = !hasMultipleValues(nodes, field) ? nodes[0][field] : MULTIPLE_VALUE_INDICATOR
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
      hasMultipleNodes: this.props.nodes && this.props.nodes.length > 1
    }

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onSubmit(formValues) {
    const { nodeValues, nodes } = this.props
    const updatedNodeValues = nodes.slice(0)

    for (const field in formValues) {
      const originalNodeValue = nodeValues[field]
      const fieldValue = formValues[field]
      let updatedValue
      if ((originalNodeValue && fieldValue) || (originalNodeValue === MULTIPLE_VALUE_INDICATOR && fieldValue !== null)) {
        // Update field in all nodes if nodes had the same field value or nodes had multiple field values and new value was set
        updatedValue = fieldValue
      }

      if (updatedValue) {
        for (let i = 0; i < updatedNodeValues.length; i++) {
          updatedNodeValues[i][field] = updatedValue
        }
      }
    }
    return this.props.onSave(updatedNodeValues)
      .catch(error => {
        throw error
      })
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
    const { nodes, nodeValues, readOnly } = this.props
    const { hasMultipleNodes, expandedFields } = this.state
    const fields = [
      {
        name: 'status',
        component: FieldFormGroupSelect,
        disabled: readOnly,
        options: STATUS_OPTIONS.map(({value, label}) => ({ value, label: this.props.intl.formatMessage({id: label}) })),
        labelId: 'portal.network.item.status.label'
      },
      {
        name: 'roles',
        className: 'input-select',
        component: FieldFormGroupSelect,
        disabled: true,
        options: NODE_ROLE_OPTIONS,
        labelId: 'portal.network.addNodeForm.role.title',
        tooltipText: 'portal.network.nodeForm.role.help.text'
      },
      {
        name: 'env',
        className: 'input-select',
        component: FieldFormGroupSelect,
        disabled: true,
        options: NODE_ENVIRONMENT_OPTIONS,
        labelId: 'portal.network.addNodeForm.environment.title',
        tooltipText: 'portal.network.nodeForm.environment.help.text'
      },
      {
        name: 'type',
        className: 'input-select',
        component: FieldFormGroupSelect,
        disabled: true,
        options: NODE_TYPE_OPTIONS,
        labelId: 'portal.network.addNodeForm.type.title',
        tooltipText: 'portal.network.nodeForm.type.help.text'
      },
      {
        name: 'cloud_driver',
        className: 'input-select',
        component: FieldFormGroupSelect,
        disabled: true,
        options: NODE_CLOUD_DRIVER_OPTIONS,
        labelId: 'portal.network.addNodeForm.cloudDriver.title',
        tooltipText: 'portal.network.nodeForm.cloudDriver.help.text'
      },
      {
        name: 'custom_grains',
        type: 'textarea',
        disabled: true,
        className: 'input-textarea',
        component: FieldFormGroup,
        labelId: 'portal.network.addNodeForm.grains.title',
        tooltipText: 'portal.network.nodeForm.grains.help.text'
      }
    ]

    return fields.map((fieldData, idx) => {
      let helpMessage = null
      let fieldToggle = null
      let isExpanded = true
      const fieldClassNames = classNames({
        'show': isExpanded,
        'hidden': !isExpanded
      })

      const fieldLabelText = <FormattedMessage id={fieldData.labelId} />
      const hasMultipleNodeValues = nodeValues[fieldData.name] === MULTIPLE_VALUE_INDICATOR

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
                    <th><FormattedMessage id="portal.network.editNodeForm.id"/></th>
                    <th><FormattedMessage id="portal.common.value"/></th>
                  </tr>
                </thead>
                <tbody>{fieldNodeValues}</tbody>
              </Table>
            </HelpPopover>
            <a className="edit-node-form__field-toggle-link pull-right" onClick={() => {
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
          <div className={fieldClassNames}>
            <Field {...fieldData}
              addonAfter={fieldData.tooltipText &&
                <HelpTooltip
                  id="tooltip-help"
                  title={<FormattedMessage id={fieldData.labelId}/>}>
                  <FormattedMessage id={fieldData.tooltipText} />
                </HelpTooltip>
              }/>
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
      submitting,
      error
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
                <th><FormattedMessage id="portal.network.editNodeForm.id"/></th>
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
                <th><FormattedMessage id="portal.network.editNodeForm.id"/></th>
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
      <form className="sp-edit-node-form" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="form-input-container">
          {error && <DefaultErrorBlock error={error}/>}
          <FormGroup>
            <label><FormattedMessage id="portal.network.editNodeForm.id"/></label>
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
        <FormFooterButtons>
          <IsAllowed to={DELETE_NODE}>
            <ButtonDisableTooltip
              tooltipId="edit-node-form__delete-disabled-tooltip"
              bsStyle="danger"
              className='pull-left'
              onClick={this.onDelete}
            >
              <FormattedMessage id="portal.common.button.delete" />
            </ButtonDisableTooltip>
          </IsAllowed>

          <Button
            id="edit-node-form__cancel-btn"
            className="btn-secondary"
            onClick={this.onCancel}>
            <FormattedMessage id="portal.common.button.cancel"/>
          </Button>
          <IsAllowed to={MODIFY_NODE}>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={pristine || invalid || submitting}>
              {submitButtonLabel}
            </Button>
          </IsAllowed>
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
  readOnly: React.PropTypes.bool,
  show: React.PropTypes.bool,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: FORM_NAME,
  validate
})(injectIntl(NetworkEditNodeForm))
