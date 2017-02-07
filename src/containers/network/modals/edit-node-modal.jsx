import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Table } from 'react-bootstrap'
import { formatUnixTimestamp } from '../../../util/helpers'
import { SubmissionError } from 'redux-form'

import { getById as getNodeById } from '../../../redux/modules/entities/nodes/selectors'
import nodeActions from '../../../redux/modules/entities/nodes/actions'

import { buildReduxId } from '../../../redux/util'

// Use this when the network container has the new entities groups
// import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import HelpPopover from '../../../components/help-popover'
import NetworkEditNodeForm, { getNodeValues, MULTIPLE_VALUE_INDICATOR } from '../../../components/network/forms/edit-node-form'

const dateFormat = 'MM/DD/YYYY HH:mm'

/**
 * build a subtitle for the modal using URL params
 * @param  {[type]} state  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getSubtitle = (state, params) => {

  const pop = getPopById(state, params.pop)

  // const group = getGroupById(state, params.group)
  const group = state.group.get('allGroups').find(group => group.get('id') == params.group)
  const network = getNetworkById(state, params.network)

  const pod = getPodById(state, buildReduxId(params.pop, params.pod))

  return `${group.get('name')} / ${network.get('name')} / ${pop.get('name')} - ${pop.get('iata')} / ${pod.get('pod_name')}`
}


class EditNodeFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteModal: false,
      hasMultipleNodes: this.props.nodes && this.props.nodes.length > 1
    }

    this.onToggleDeleteModal = this.onToggleDeleteModal.bind(this)
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  render() {
    const { show, onCancel, onSave, initialValues, intl, nodeValues, nodes, subTitle } = this.props
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
          dateLists[dateProp].push(<tr key={i}><td>{node.id}</td><td>{formatUnixTimestamp(node[dateProp], dateFormat)}</td></tr>)
        }
      }
    }

    const multipleValuesText = <FormattedMessage id="portal.network.editNodeForm.multipleValues"/>

    const createdText = <FormattedMessage id="portal.common.date.created"/>
    const updatedText = <FormattedMessage id="portal.common.date.updated"/>

    const panelTitle = hasMultipleNodes ?
      <FormattedMessage id="portal.network.editNodeForm.title.multiple" values={{numNodes: nodes.length}} /> :
      <FormattedMessage id="portal.network.editNodeForm.title" />
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
          {!hasMultipleNodes && <span className="edit-node__dates--single-date">{formatUnixTimestamp(firstNode.created, dateFormat)}</span>}
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
          {!hasMultipleNodes && <span className="edit-node__dates--single-date">{formatUnixTimestamp(firstNode.updated, dateFormat)}</span>}
        </span>
      </div>
    )

    const sidePanelProps = {
      cancel: onCancel,
      show,
      subTitle,
      subSubTitle: panelSubTitle2,
      title: panelTitle
    }

    const formProps = {
      intl,
      initialValues,
      nodeValues,
      nodes,
      onCancel,
      onDelete: this.onToggleDeleteModal,
      onSave
    }

    const deleteModalProps = {
      title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: <FormattedMessage id="portal.network.editNodeForm.node" />}}/>,
      content: <FormattedMessage id="portal.network.deleteNodesConfirmation.text" values={{numNodes: nodes.length}}/>,
      verifyDelete: true,
      deleteButton: true,
      cancelButton: true,
      cancel: () => this.onToggleDeleteModal(false),
      onSubmit: () => {
        return this.props.onDelete(this.props.nodes).catch(error => {
          throw error
        })
      }
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
  nodeValues: React.PropTypes.object,
  nodes: React.PropTypes.array,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool,
  subTitle: React.PropTypes.string
}

const mapStateToProps = (state, { nodeIds, params }) => {
  const nodes = nodeIds.map(id => {

    const nodeValues = getNodeById(state)(id) || { roles: [] }

    nodeValues.roles = nodeValues.roles[0]

    return nodeValues
  })
  const nodeValues = getNodeValues(nodes)

  const initialValues = {}
  for (let field in nodeValues) {
    const value = nodeValues[field]
    initialValues[field] = value === MULTIPLE_VALUE_INDICATOR ? null : value
  }

  return {
    subTitle: getSubtitle(state, params),
    nodes,
    initialValues,
    nodeValues
  }
}

const mapDispatchToProps = (dispatch, { params, onCancel }) => {

  /* eslint-disable no-unused-vars*/
  const updateNode = ({ reduxId, ...node }) => dispatch(nodeActions.update({ ...params, id: node.id, payload: node }))
    .then(({ error }) => {
      if (error) {
        return Promise.reject(new SubmissionError({ _error: error.data.message }))
      }
    })

  const deleteNode = id => dispatch(nodeActions.remove({ ...params, id }))
    .then(({ error }) => {
      if (error) {
        return Promise.reject(new SubmissionError({ _error: error.data.message }))
      }
    })

  return {

    onSave: nodes => {
      return Promise.all(
        nodes.map(
          node => {
            node.roles = [ node.roles ]
            return updateNode(node)
          }
        )
      ).then(() => onCancel())
    },

    onDelete: nodes => {
      return Promise.all(
        nodes.map(
          ({ id }) => deleteNode(id)
        )
      ).then(() => onCancel())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditNodeFormContainer))
