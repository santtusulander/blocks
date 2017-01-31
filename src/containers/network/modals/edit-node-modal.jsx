import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Table } from 'react-bootstrap'
import { formatDate } from '../../../util/helpers'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import HelpPopover from '../../../components/help-popover'
import NetworkEditNodeForm, { FORM_NAME } from '../../../components/network/forms/edit-node-form'

const dateFormat = 'MM/DD/YYYY HH:mm'

class EditNodeFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteModal: false,
      hasMultipleNodes: props.nodes && props.nodes.length > 1
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onToggleDeleteModal = this.onToggleDeleteModal.bind(this)
  }

  onSubmit(values) {
    // @TODO: on submit functionality
    this.props.onSave(values)
  }

  onDelete() {
    // @TODO delete functionality
    const { nodes } = this.props
    this.props.onDelete(nodes)
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  render() {
    const { show, onCancel, initialValues, intl, nodes } = this.props
    const { hasMultipleNodes, showDeleteModal } = this.state
    const firstNode = nodes[0]
    const dateLists = {
      created: [],
      updated: []
    }

    if (hasMultipleNodes) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        for (let dateProp in dateLists) {
          dateLists[dateProp].push(<tr key={i}><td>{node.id}</td><td>{formatDate(node[dateProp], dateFormat)}</td></tr>)
        }
      }
    }

    const multipleValuesText = <FormattedMessage id="portal.network.editNodeForm.multipleValues"/>

    const createdText = <FormattedMessage id="portal.common.date.created"/>
    const updatedText = <FormattedMessage id="portal.common.date.updated"/>

    const panelTitle = hasMultipleNodes ?
      <FormattedMessage id="portal.network.editNodeForm.title.multiple" values={{numNodes: nodes.length}} /> :
      <FormattedMessage id="portal.network.editNodeForm.title" />
    const panelSubTitle = ['Group X', 'Network Y', 'POP 1 - Chicago', 'POD2'].join(' / ') // @TODO add real values when redux connected
    const panelSubTitle2 = (
      <div>
        <span className="edit-node__dates edit-node__dates--created">
          {createdText}:
          {hasMultipleNodes &&
          <HelpPopover id="edit-node__tooltip-created" buttonText={multipleValuesText} title={createdText} placement="bottom">
            <Table striped={true} condensed={true}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th><FormattedMessage id="portal.common.date"/></th>
                </tr>
              </thead>
              <tbody>{dateLists.created}</tbody>
            </Table>
          </HelpPopover>}
          {!hasMultipleNodes && <span className="edit-node__dates--single-date">{formatDate(firstNode.created, dateFormat)}</span>}
        </span>
        <span className="edit-node__dates edit-node__dates--updated">
          {updatedText}:
          {hasMultipleNodes &&
          <HelpPopover id="edit-node__tooltip-updated" buttonText={multipleValuesText} title={updatedText} placement="bottom">
            <Table striped={true} condensed={true}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th><FormattedMessage id="portal.common.date"/></th>
                </tr>
              </thead>
              <tbody>{dateLists.updated}</tbody>
            </Table>
          </HelpPopover>}
          {!hasMultipleNodes && <span className="edit-node__dates--single-date">{formatDate(firstNode.updated, dateFormat)}</span>}
        </span>
      </div>
    )

    const sidePanelProps = {
      cancel: onCancel,
      show,
      subTitle: panelSubTitle,
      subSubTitle: panelSubTitle2,
      title: panelTitle
    }

    const formProps = {
      intl,
      initialValues,
      nodes,
      onCancel,
      onDelete: this.onToggleDeleteModal,
      onSave: this.onSubmit
    }

    const deleteModalProps = {
      title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: <FormattedMessage id="portal.network.editNodeForm.node" />}}/>,
      content: <FormattedMessage id="portal.network.deleteNodesConfirmation.text" values={{numNodes: nodes.length}}/>,
      verifyDelete: true,
      deleteButton: true,
      cancelButton: true,
      cancel: () => this.onToggleDeleteModal(false),
      onSubmit: this.onDelete
    }

    return (
      <div className="edit-node-form__container">
        <SidePanel {...sidePanelProps}>
          <NetworkEditNodeForm {...formProps}/>
          {showDeleteModal && <ModalWindow {...deleteModalProps}/>}
        </SidePanel>
      </div>
    )
  }
}

EditNodeFormContainer.displayName = "NetworkEditNodeContainer"

EditNodeFormContainer.propTypes = {
  initialValues: React.PropTypes.object,
  intl: intlShape.isRequired,
  nodes: React.PropTypes.array,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool
}

const formSelector = formValueSelector(FORM_NAME)

function hasMultipleValues(nodes, field) {
  const firstValue = nodes[0][field]
  return nodes.some(node => {
    return node[field] !== firstValue
  })
}

function getNodeValues(nodes) {
  if (!nodes) {
    return {}
  } else if (nodes.length === 1) {
    return nodes[0]
  }

  const fields = ['node_role', 'node_env', 'node_type', 'cloud_driver']
  const nodeValues = {}
  fields.forEach(field => {
    nodeValues[field] = !hasMultipleValues(nodes, field) ? nodes[0][field] : null
  })

  return nodeValues
}

const mapStateToProps = (state, ownProps) => {
  const { nodes } = ownProps
  const nodeValues = getNodeValues(nodes)
  const nodeRole = formSelector(state, 'node_role') || nodeValues.node_role
  const nodeEnv = formSelector(state, 'node_env')  || nodeValues.node_env
  const nodeType = formSelector(state, 'node_type') || nodeValues.node_type
  const cloudDriver = formSelector(state, 'cloud_driver') || nodeValues.cloud_driver
  return {
    initialValues: {
      node_role: nodeRole,
      node_env: nodeEnv,
      node_type: nodeType,
      cloud_driver: cloudDriver
    }
  }
}

export default connect(mapStateToProps)(injectIntl(EditNodeFormContainer))
