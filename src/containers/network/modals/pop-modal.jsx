import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
//TODO: import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'

import SidePanel from '../../../components/side-panel'
//TODO: import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

import NetworkPopForm from '../../../components/network/forms/pop-form.jsx'

const mockReduxCalls = {
  get: function(cmd) {
    switch (cmd) {
      case 'name':
        return "POP Name"

      case 'group':
        return "Group 1"

      case 'network':
        return "Network 1"

      case 'location':
        return [{
          value: 'ORD',
          label: 'ORD, Chicago'
        }, {
          value: 'OLD',
          label: 'OLD, Miami'
        }, {
          value: 'MDL',
          label: 'MDL, Lviv'
        }]

      case 'locationId':
        return 'MDL'

      case 'popId':
        return "1"

      case 'createdDate':
        return "October 13, 2014 11:13:00"

      case 'updatedDate':
        return "October 13, 2017 11:13:00"

      case 'fetching':
        return false

      default:
        return null
    }
  }
}

class NetworkPopFormContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { edit, fetching, initialValues, selectedLocationId, selectedPopId, onSave, onDelete, closeModal } = this.props

    const title = edit ? <FormattedMessage id='portal.network.popEditForm.editPop.title' />
                       : <FormattedMessage id='portal.network.popEditForm.addPop.title' />
    const subTitle = `${initialValues.group} / ${initialValues.network}`
    const subSubTitle = edit ? `Created: ${initialValues.createdDate} | Updated: ${initialValues.updatedDate}` : ''

    return (
      <SidePanel
        show={true}
        title={title}
        subTitle={subTitle}
        subSubTitle={subSubTitle}
        cancel={() => closeModal()}
      >

        <NetworkPopForm
          edit={edit}
          fetching={fetching}
          selectedLocationId={selectedLocationId}
          selectedPopId={selectedPopId}
          initialValues={initialValues}
          onDelete={(popId) => onDelete(popId)}
          onSave={(values) => onSave(edit, values)}
          onCancel={() => closeModal()}
        />

      </SidePanel>
    )
  }
}

NetworkPopFormContainer.displayName = "NetworkPopFormContainer"
NetworkPopFormContainer.propTypes = {
  closeModal: PropTypes.func,
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  selectedLocationId: PropTypes.string,
  selectedPopId: PropTypes.string
}

const formSelector = formValueSelector('networkPopEditForm')
const mapStateToProps = (state, ownProps) => {
  const selectedLocationId = formSelector(state, 'locationId')
  const selectedPopId = formSelector(state, 'popId')

  const props = {
    fetching: mockReduxCalls.get('fetching'),
    selectedLocationId: selectedLocationId,
    selectedPopId: selectedPopId,
    initialValues: {
      name: ownProps.edit ? mockReduxCalls.get('name') : '',
      group: mockReduxCalls.get('group'),
      network: mockReduxCalls.get('network'),
      createdDate: ownProps.edit ? mockReduxCalls.get('createdDate') : '',
      updatedDate: ownProps.edit ? mockReduxCalls.get('updatedDate') : '',
      locationOptions: mockReduxCalls.get('location'),
      locationId: ownProps.edit ? mockReduxCalls.get('locationId') : '',
      popId: ownProps.edit ? mockReduxCalls.get('popId') : ''
    }
  }

  return props
}

export default connect(mapStateToProps)(NetworkPopFormContainer)
