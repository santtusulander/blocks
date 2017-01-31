import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { SubmissionError } from 'redux-form'

import { withRouter } from 'react-router'

import { Map } from 'immutable'

import networkActions from '../../../redux/modules/entities/networks/actions'
import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import SidePanel from '../../../components/side-panel'
import NetworkForm from '../../../components/network/forms/network-form'
import '../../../components/account-management/group-form.scss'

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.checkforPops = this.checkforPops.bind(this)
  }

  /**
   * hander for save
   */
  onSave(edit, values) {

    const data = {
      id: values.name,
      description: values.description
    }

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      payload: data
    }

    if (edit) params.id = data.id;
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then( (resp) => {
        if (resp.error) {
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        this.props.onCancel();
      })
      .catch( (resp) => {
        throw new SubmissionError({'_error': resp.error.data.message})
      })
  }

  onDelete(networkId) {
    return this.props.onDelete(networkId)
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
            onSave={(values) => this.onSave(edit, values)}
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
  accountId: PropTypes.string,
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  group: PropTypes.instanceOf(Map).isRequired,
  groupId: PropTypes.string,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  name: PropTypes.string,
  //network: PropTypes.instanceOf(Map),
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  show: PropTypes.bool
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map()
}


const mapStateToProps = (state, ownProps) => {
  const network = ownProps.networkId && getNetworkById(state, ownProps.networkId)

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network,

    initialValues: {
      name: ownProps.edit && network ? network.get('name') : '',
      description: ownProps.edit && network ? network.get('description') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( networkActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( networkActions.update( {...params, data } )),
    onDelete: (params, networkId) => dispatch( networkActions.remove( networkId ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(withRouter(NetworkFormContainer))
)
