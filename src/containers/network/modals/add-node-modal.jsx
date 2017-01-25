import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SidePanel from '../../../components/side-panel'
import NetworkAddNodeForm from '../../../components/network/forms/add-node-form'

class AddNodeFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showConfirmation: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onToggleConfirm = this.onToggleConfirm.bind(this)
  }

  onSubmit(values) {
    // TODO: on submit functionality
    this.props.onSave(values)
  }

  onToggleConfirm(showConfirmation) {
    this.setState({ showConfirmation })
  }

  render() {
    const { show, onCancel, intl} = this.props
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
            onSave={this.onSubmit}
            onCancel={onCancel}
            onToggleConfirm={this.onToggleConfirm}
          />
        </SidePanel>
      </div>
    )
  }
}

AddNodeFormContainer.displayName = "NetworkFormContainer"

AddNodeFormContainer.propTypes = {
  intl: intlShape.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}


function mapStateToProps() {
  return {} // @TODO Redux integration
}

export default connect(mapStateToProps)(injectIntl(AddNodeFormContainer))
