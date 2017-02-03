import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import nodeActions from '../../../redux/modules/entities/nodes/actions'
import SidePanel from '../../../components/side-panel'
import NetworkAddNodeForm from '../../../components/network/forms/add-node-form'
import { ADD_NODE_FORM_NAME } from '../../../components/network/forms/add-node-form'
import { NETWORK_DOMAIN_NAME, NODE_ENVIRONMENT_OPTIONS } from '../../../constants/network'

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
      name: values.name,
      id: values.name
    }

    return this.props.onSave(node)
  }

  onToggleConfirm(showConfirmation) {
    this.setState({ showConfirmation })
  }

  render() {
    const { show, onCancel, initialValues, intl, nodeNameData, numNodes } = this.props
    const { showConfirmation } = this.state

    const panelTitle = <FormattedMessage id="portal.network.addNodeForm.title" />
    const panelSubTitle = ['Group X', 'Network Y', 'POP 1 - Chicago', 'POD2'].join(' / ') // @TODO add real values when redux connected
    return (
      <div className="add-node-form__container">
        <SidePanel
          show={show}
          title={panelTitle}
          subTitle={panelSubTitle}
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
  params: PropTypes.object,
  show: PropTypes.bool
}

const formSelector = formValueSelector(ADD_NODE_FORM_NAME)

function buildNodeNameData(nameCode, nodeEnv, nodeType) {
  const domain = NETWORK_DOMAIN_NAME
  const location = 'pod1' // @TODO replace with POD from Redux
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

const mapStateToProps = (state) => {
  const numNodes = formSelector(state, 'numNodes') || 1
  const nameCode = formSelector(state, 'nameCode') || 0
  const nodeEnv = formSelector(state, 'node_env') || 'production'
  const nodeType = formSelector(state, 'node_type')

  const nodeNameData = buildNodeNameData(nameCode, nodeEnv, nodeType)
  return {
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

const mapDispatchToProps = (dispatch, { params, onCancel }) => ({
  onSave: node => dispatch(nodeActions.create({ ...params, payload: node })).then(() => onCancel())
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddNodeContainer))
