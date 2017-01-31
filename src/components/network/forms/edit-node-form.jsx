import React from 'react'

import {
  Button,
  FormGroup,
  Table
} from 'react-bootstrap'

import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import HelpPopover from '../../help-popover'
import ButtonDisableTooltip from '../../button-disable-tooltip'

import { checkForErrors } from '../../../util/helpers'
import { isInt } from '../../../util/validators'

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

function getValueLabel(options, value) {
  for (let i = 0, len = options.length; i < len; i++) {
    const option = options[i]
    if (option.value === value) {
      return option.label
    }
  }
  return null
}

class NetworkEditNodeForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      expandedFields: {},
      hasMultipleNodes: props.nodes && props.nodes.length > 1
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

  hasMultipleValues(field) {
    const { nodes } = this.props
    const firstValue = nodes[0][field]
    return nodes.some(node => {
      return node[field] !== firstValue
    })
  }

  getFields() {
    const { nodes } = this.props
    const { hasMultipleNodes, expandedFields } = this.state
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
      }
    ]

    return fields.map((obj, idx) => {
      let helpMessage = null
      let fieldToggle = null
      let isExpanded = true
      const fieldLabelText = <FormattedMessage id={obj.labelId} />

      if (hasMultipleNodes) {
        const hasMultipleValues = this.hasMultipleValues(obj.name)

        if (hasMultipleValues) {
          isExpanded = expandedFields[obj.name] === true
          helpMessage = <FormattedMessage id="portal.network.editNodeForm.multipleValues.help"/>

          const linkTextId = isExpanded ? 'portal.common.button.cancel' : 'portal.common.button.edit'
          const helpPopoverId = 'edit-node-form__field-popover-' + obj.name

          const fieldNodeValues = nodes.map((node, nodeIndex) => {
            const field = node[obj.name]
            const valueLabel = getValueLabel(obj.options, field)
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
                this.onToggleField(obj.name)
              }}>
                <FormattedMessage id={linkTextId}/>
              </a>
            </div>
          )
        }
      }

      return (
        <FormGroup key={idx}>
          <label>{fieldLabelText}</label>
          {fieldToggle}
          <div className={isExpanded ? 'show' : 'hidden'}>
            <Field
              name={obj.name}
              className={obj.className}
              component={obj.component}
              options={obj.options}
            />
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
      submitting
    } = this.props

    const { hasMultipleNodes } = this.state


    let idValues = nodes[0].id
    let nameValues = nodes[0].name

    if (hasMultipleNodes) {
      if (this.hasMultipleValues('id')) {
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
      if (this.hasMultipleValues('name')) {
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
              disabled={invalid||submitting}>
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


