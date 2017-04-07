import React, { PropTypes } from 'react'
import { formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import SidePanel from '../../../components/shared/side-panel'
import RoutingDaemonForm from '../../../components/network/forms/routing-daemon-form'

class RoutingDaemonFormContainer extends React.Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props

    onSave(values)
  }

  render() {
    const {
      intl,
      onCancel,
      show,
      initialValues,
      readOnly
    } = this.props

    const edit = !!initialValues.bgp_as_number
    const formTitle = edit ? 'portal.network.spConfig.routingDaemon.editForm.title' : 'portal.network.spConfig.routingDaemon.addForm.title'

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: formTitle })}
        cancel={onCancel}
        overlapping={true}
      >
      <RoutingDaemonForm
        initialValues={initialValues}
        editing={edit}
        onCancel={onCancel}
        onSubmit={this.onSubmit}
        readOnly={readOnly}
      />
      </SidePanel>
    )
  }
}

RoutingDaemonFormContainer.displayName = 'RoutingDaemonFormContainer'
RoutingDaemonFormContainer.propTypes = {
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  readOnly: PropTypes.bool,
  show: PropTypes.bool
}

/* istanbul ignore next */
const mapStateToProps = (state) => {
  const selector = formValueSelector('pod-form')

  return {
    initialValues: {
      bgp_as_number: selector(state, 'UIsp_bgp_router_as'),
      bgp_router_ip: selector(state, 'UIsp_bgp_router_ip'),
      bgp_password: selector(state, 'UIsp_bgp_router_password')
    }
  }
}

/* istanbul ignore next */
const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RoutingDaemonFormContainer))
