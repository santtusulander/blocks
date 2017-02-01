import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import nodeActions from '../../../redux/modules/entities/nodes/actions'
import SidePanel from '../../../components/side-panel'
import NetworkAddNodeForm from '../../../components/network/forms/add-node-form'
import { ADD_NODE_FORM_NAME } from '../../../components/network/forms/add-node-form'

class AddNodeContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showConfirmation: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onToggleConfirm = this.onToggleConfirm.bind(this)
  }
// {
//   "pop_id": "par",
//   "name": "sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net",
//   "roles": ["cache"],
//   "env": "cdx-dev",
//   "custom_grains": [],
//   "type": 1,
//   "id": "sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net",
//   "pod_id": "pod10"
// }

  onSubmit(values) {
    const node = {
      roles: [ values.node_role ],
      cloud_driver: values.cloud_driver,
      pod_id: this.props.params.pod,
      pop_id: this.props.params.pop,
      env: values.node_env,
      custom_grains: [],
      type: values.node_type,


    }
    console.log(values);
    // TODO: on submit functionality
    // this.props.onSave(node)
  }

  onToggleConfirm(showConfirmation) {
    this.setState({ showConfirmation })
  }

  render() {
    const { show, onCancel, initialValues, intl, numNodes } = this.props
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
  numNodes: PropTypes.number,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.object,
  show: PropTypes.bool
}

const formSelector = formValueSelector(ADD_NODE_FORM_NAME)

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

const mapDispatchToProps = dispatch => ({
  onSave: node => dispatch(nodeActions.create(node))
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddNodeContainer))
