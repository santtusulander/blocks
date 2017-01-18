import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Map } from 'immutable'

import SidePanel from '../../../components/side-panel'
import NetworkForm from '../../../components/network/modals/network-form'
import '../../../components/account-management/group-form.scss'

const mockRedux = {
  get: function(field) {
    switch (field) {
      case 'description':
        return "This is network  test description"

      case 'name':
        return "Network Test"

      default:
        return null
    }
  }
}

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  //TODO Fix onSubmit
  onSubmit(values) {
    const { networkId, invalid, onSave } = this.props
    if(!invalid) {
      if (networkId) {
        return onSave(
          networkId,
          values
        )
      } else {
        return onSave(values)
      }
    }
  }

  render() {
    const {
      account,
      group,
      networkId,
      initialValues,
      show,
      name,
      onCancel,
      intl,
      invalid} = this.props

    const title = networkId ? <FormattedMessage id="portal.network.networkForm.editNetwork.title"/> : <FormattedMessage id="portal.network.networkForm.newNetwork.title"/>
    const subTitle = networkId ? `${account.get('name')} / ${group.get('name')} / ${name}` : `${account.get('name')} / ${group.get('name')}`
    return (
      <div>
        <SidePanel
          show={show}
          title={title}
          subTitle={subTitle}
          cancel={onCancel}
          >
          <NetworkForm
            networkId={networkId}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            onCancel={onCancel}
            onSubmit={this.onSubmit} />
        </SidePanel>
      </div>
    )
  }
}

NetworkFormContainer.displayName = "NetworkFormContainer"

NetworkFormContainer.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  group: PropTypes.instanceOf(Map).isRequired,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  name: PropTypes.string,
  networkId: PropTypes.number,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map()
}


function mapStateToProps(state) {
  return {
    account: state.account.get('activeAccount'),
    group: state.group.get('activeGroup'),
    name: state.network.getIn(['activeNetwork', 'name']),
    initialValues: {
      name: mockRedux.get('name'),
      description: mockRedux.get('description')
    }
  }
}

export default connect(mapStateToProps)(
  injectIntl(NetworkFormContainer)
)
