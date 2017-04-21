import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector, SubmissionError } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

// Use this when the network container has the new entities groups
// import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'

import { buildReduxId, parseResponseError } from '../../../redux/util'

import nodeActions from '../../../redux/modules/entities/nodes/actions'
import { changeNotification } from '../../../redux/modules/ui'

import SidePanel from '../../../components/shared/side-panel'
import NetworkAddNodeForm from '../../../components/network/forms/add-node-form'
import { ADD_NODE_FORM_NAME } from '../../../components/network/forms/add-node-form'
import { NODE_TYPE_DEFAULT,
         NODE_ROLE_DEFAULT,
         NODE_ENVIRONMENT_DEFAULT,
         NODE_CLOUD_DRIVER_DEFAULT } from '../../../constants/network'

import { generateNodeName } from '../../../util/network-helpers'

const formSelector = formValueSelector(ADD_NODE_FORM_NAME)

/**
 * build a subtitle for the modal using URL params
 * @param  {[type]} state  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getSubtitle = (state, params) => {

  const pop = getPopById(state, buildReduxId(params.group, params.network, params.pop))

  // const group = getGroupById(state, params.group)
  // eslint-disable-next-line eqeqeq
  const group = state.group.get('allGroups').find(group => group.get('id') == params.group)

  const network = getNetworkById(state, buildReduxId(params.group, params.network))

  const pod = getPodById(state, buildReduxId(params.group, params.network, params.pop, params.pod))

  return `${group.get('name')} / ${network.get('name')} / ${pop.get('name')} - ${pop.get('iata')} / ${pod.get('pod_name')}`
}

/**
 * Modal
 */
class AddNodeContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showConfirmation: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onToggleConfirm = this.onToggleConfirm.bind(this)
  }

  onSubmit(values) {
    const node = {
      roles: [ values.node_role ],
      cloud_driver: values.cloud_driver,
      pod_id: this.props.params.pod,
      pop_id: this.props.params.pop,
      env: values.node_env,
      custom_grains: [],
      type: values.node_type,
      name: values.node_name,
      id: values.node_name
    }

    return this.props.onSave(node)
  }

  onToggleConfirm(showConfirmation) {
    this.setState({ showConfirmation })
  }

  render() {
    const {
      show,
      onCancel,
      initialValues,
      intl,
      numNodes,
      nodeName,
      subtitle,
      nodePermissions
    } = this.props
    const { showConfirmation } = this.state

    const panelTitle = <FormattedMessage id="portal.network.addNodeForm.title" />
    return (
      <div className="add-node-form__container">
        <SidePanel
          show={show}
          title={panelTitle}
          subTitle={subtitle}
          cancel={onCancel}
          dim={showConfirmation}>
          <NetworkAddNodeForm
            intl={intl}
            nodeName={nodeName}
            numNodes={numNodes}
            initialValues={initialValues}
            onSave={this.onSubmit}
            onCancel={onCancel}
            onToggleConfirm={this.onToggleConfirm}
            nodePermissions={nodePermissions}
          />
        </SidePanel>
      </div>
    )
  }
}

AddNodeContainer.displayName = "AddNodeContainer"

AddNodeContainer.propTypes = {
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  nodeName: PropTypes.string,
  nodePermissions: PropTypes.object,
  numNodes: PropTypes.number,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.object,
  show: PropTypes.bool,
  subtitle: PropTypes.string
}

/* istanbul ignore next */
const mapStateToProps = (state, { params }) => {
  const numNodes = formSelector(state, 'numNodes') || 1
  const serverNumber = formSelector(state, 'serverNumber') || 0
  const nodeEnv = formSelector(state, 'node_env') || NODE_ENVIRONMENT_DEFAULT
  const nodeRole = formSelector(state, 'node_role') || NODE_ROLE_DEFAULT

  const pop = getPopById(state, buildReduxId(params.group, params.network, params.pop))
  const pod = getPodById(state, buildReduxId(params.group, params.network, params.pop, params.pod))

  const nodeName = generateNodeName({
    pod_id: pod && pod.get('pod_name'),
    iata: pop && pop.get('iata'), //id should contain IATA + id eg. GKA13
    serverNumber: serverNumber,
    node_role: nodeRole,
    node_env: nodeEnv
  })

  return {
    subtitle: getSubtitle(state, params),
    numNodes,
    nodeName,
    initialValues: {
      numNodes: 1,
      serverNumber: 0,
      cloud_driver: NODE_CLOUD_DRIVER_DEFAULT,
      node_role: NODE_ROLE_DEFAULT,
      node_type: NODE_TYPE_DEFAULT,
      node_env: NODE_ENVIRONMENT_DEFAULT,
      node_name: nodeName
    }
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch, { params, onCancel }) => ({

  onSave: node => {

    return dispatch(nodeActions.create({ ...params, payload: node }))
      .then(() => {
        const showNotification = (message) => dispatch(changeNotification(message))
        showNotification(<FormattedMessage id="portal.network.addNodeForm.createNode.status"/>)
        setTimeout(showNotification, 10000)
        onCancel()
      }).catch(response => {
        throw new SubmissionError({ '_error': parseResponseError(response) })
      })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddNodeContainer))
