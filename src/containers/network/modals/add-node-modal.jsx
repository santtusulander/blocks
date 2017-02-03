import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector, SubmissionError } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

// Use this when the network container has the new entities groups
// import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'


import nodeActions from '../../../redux/modules/entities/nodes/actions'
import SidePanel from '../../../components/side-panel'
import NetworkAddNodeForm from '../../../components/network/forms/add-node-form'
import { ADD_NODE_FORM_NAME } from '../../../components/network/forms/add-node-form'
import { NETWORK_DOMAIN_NAME, NODE_ENVIRONMENT_OPTIONS } from '../../../constants/network'

const formSelector = formValueSelector(ADD_NODE_FORM_NAME)

/**
 * Build a name for the node
 * @param  {[type]} nameCode [description]
 * @param  {[type]} nodeEnv  [description]
 * @param  {[type]} nodeType [description]
 * @param  {[type]} pod      [description]
 * @return {[type]}          [description]
 */
function buildNodeNameData(nameCode, nodeEnv, nodeType, { pod }) {
  const domain = NETWORK_DOMAIN_NAME
  const location = pod
  const cacheEnv = NODE_ENVIRONMENT_OPTIONS.find(obj => obj.value === nodeEnv).cacheValue

  return {
    name: `${nodeType}${nameCode}.${location}.${cacheEnv}.${domain}`,
    props: {
      cacheEnv,
      domain,
      location,
      nameCode,
      nodeType
    }
  }
}

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

  //TODO This is fragile. In the future, have the same helper method construct the Id
  //that will be used to create it in the first place.
  const pod = getPodById(state, `${params.pop}-${params.pod}`)

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
<<<<<<< HEAD
    // TODO: on submit functionality
    this.props.onSave(values)
=======
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
>>>>>>> 73d58f89969ce0945c1f9b39ac915984aff5b612
  }

  onToggleConfirm(showConfirmation) {
    this.setState({ showConfirmation })
  }

  render() {
    const { show, onCancel, initialValues, intl, nodeNameData, numNodes, subtitle } = this.props
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
            nodeNameData={nodeNameData}
            numNodes={numNodes}
            initialValues={initialValues}
            onSave={this.onSubmit}
            onCancel={onCancel}
            onToggleConfirm={this.onToggleConfirm}
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
  nodeNameData: PropTypes.object,
  numNodes: PropTypes.number,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
<<<<<<< HEAD
  show: PropTypes.bool
=======
  params: PropTypes.object,
  show: PropTypes.bool,
  subtitle: PropTypes.string
>>>>>>> 73d58f89969ce0945c1f9b39ac915984aff5b612
}

const mapStateToProps = (state, { params }) => {
  const numNodes = formSelector(state, 'numNodes') || 1
  const nameCode = formSelector(state, 'nameCode') || 0
  const nodeEnv = formSelector(state, 'node_env') || 'production'
  const nodeType = formSelector(state, 'node_type')
<<<<<<< HEAD

  const nodeNameData = buildNodeNameData(nameCode, nodeEnv, nodeType)
=======

  const nodeNameData = buildNodeNameData(nameCode, nodeEnv, nodeType, params)

>>>>>>> 73d58f89969ce0945c1f9b39ac915984aff5b612
  return {
    subtitle: getSubtitle(state, params),
    numNodes,
    nodeNameData,
    initialValues: {
      numNodes: 1,
      nodeNameCode: 0,
      node_role: 'cache',
      node_env: 'production'
    }
  }
}

<<<<<<< HEAD
export default connect(mapStateToProps)(injectIntl(AddNodeContainer))
=======
const mapDispatchToProps = (dispatch, { params, onCancel }) => ({

  onSave: node => {

    return dispatch(nodeActions.create({ ...params, payload: node }))
      .then(({ error }) => {
        if (error) {
          return Promise.reject(new SubmissionError({ _error: error.data.message }))
        }
        onCancel()
      })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddNodeContainer))
>>>>>>> 73d58f89969ce0945c1f9b39ac915984aff5b612
