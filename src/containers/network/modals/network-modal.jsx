import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Map } from 'immutable'

import SidePanel from '../../../components/side-panel'
import NetworkForm from '../../../components/network/forms/network-form'
import '../../../components/account-management/group-form.scss'

//TODO Remove mock after Redux integration
const mockRedux = {
  get: function(field) {
    switch (field) {
      case 'description':
        return "This is network  test description"

      case 'name':
        return "Network Test"

      case 'fetching':
        return false

      default:
        return null
    }
  }
}

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.checkforPops = this.checkforPops.bind(this)
  }

  onSubmit(edit, values) {
    // TODO: on submit functionality
    this.props.onSave(edit, values)
  }

  onDelete(networkId) {
    // TODO: on delete functionality
    this.props.onDelete(networkId)
  }

  checkforPops() {
    //TODO: this should check weather the current Network has POPs or not
    return true
  }

  render() {
    const { edit, fetching, account, group, networkId, initialValues, show, name, onCancel, intl, invalid} = this.props

    const title = edit ? <FormattedMessage id="portal.network.networkForm.editNetwork.title"/>
                       : <FormattedMessage id="portal.network.networkForm.newNetwork.title"/>
    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${name}`
                          : `${account.get('name')} / ${group.get('name')}`
    return (
      <div>
        <SidePanel show={show} title={title} subTitle={subTitle} cancel={onCancel}>
          <NetworkForm
            edit={edit}
            fetching={fetching}
            networkId={networkId}
            hasPops={this.checkforPops()}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            onSave={(values) => this.onSubmit(edit, values)}
            onDelete={(networkId) => this.onDelete(networkId)}
            onCancel={onCancel} />
        </SidePanel>
      </div>
    )
  }
}

NetworkFormContainer.displayName = "NetworkFormContainer"

NetworkFormContainer.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  group: PropTypes.instanceOf(Map).isRequired,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  name: PropTypes.string,
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map()
}


function mapStateToProps(state, ownProps) {
  return {
    account: state.account.get('activeAccount'),
    group: state.group.get('activeGroup'),
    fetching: mockRedux.get('fetching'),
    //name: state.network.getIn(['activeNetwork', 'name']),
    initialValues: {
      name: ownProps.edit ? mockRedux.get('name') : '',
      description: ownProps.edit ? mockRedux.get('description') : ''
    }
  }
}

export default connect(mapStateToProps)(
  injectIntl(NetworkFormContainer)
)
