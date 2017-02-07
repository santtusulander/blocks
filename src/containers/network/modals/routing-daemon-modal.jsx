import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import SidePanel from '../../../components/side-panel'
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
      editing,
      intl,
      onCancel,
      show
    } = this.props

    const formTitle = editing ? 'portal.network.spConfig.routingDaemon.editForm.title' : 'portal.network.spConfig.routingDaemon.addForm.title'

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: formTitle })}
        cancel={onCancel}
      >
      <RoutingDaemonForm
        editing={editing}
        onCancel={onCancel}
        onSubmit={this.onSubmit}
      />
      </SidePanel>
    )
  }
}

RoutingDaemonFormContainer.displayName = 'RoutingDaemonFormContainer'
RoutingDaemonFormContainer.propTypes = {
  editing: PropTypes.bool,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RoutingDaemonFormContainer))
