import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'

import SidePanel from '../../../components/side-panel'
import NetworkPopForm from '../../../components/network/forms/pop-form.jsx'

const mockReduxCalls = {
  get: function(cmd) {
    switch (cmd) {
      case 'name':
        return "POP Name"

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

    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onSubmit(edit, values) {
    // TODO: on submit functionality
    this.props.onSave(edit, values)
  }

  onDelete(popId) {
    // TODO: on delete functionality
    this.props.onDelete(popId)
  }

  render() {
    const { edit, fetching, initialValues, selectedLocationId,
            selectedPopId, onCancel, groupId, networkId, show } = this.props

    const title = edit ? <FormattedMessage id='portal.network.popEditForm.editPop.title' />
                       : <FormattedMessage id='portal.network.popEditForm.addPop.title' />
    const subTitle = (<FormattedMessage id="portal.network.subTitle.context.text"
                                        values={{
                                          groupId: groupId,
                                          networkId: networkId
                                        }} />)
    const subSubTitle = edit ? (<FormattedMessage id="portal.network.subTitle.date.text"
                                                  values={{
                                                    createdDate: initialValues.createdDate,
                                                    updatedDate: initialValues.updatedDate
                                                  }} />) : ''

    return (
      <SidePanel
        show={show}
        title={title}
        subTitle={subTitle}
        subSubTitle={subSubTitle}
        cancel={() => onCancel()}
      >

        <NetworkPopForm
          edit={edit}
          fetching={fetching}
          selectedLocationId={selectedLocationId}
          selectedPopId={selectedPopId}
          initialValues={initialValues}
          onDelete={(popId) => this.onDelete(popId)}
          onSave={(values) => this.onSubmit(edit, values)}
          onCancel={() => onCancel()}
        />

      </SidePanel>
    )
  }
}

NetworkPopFormContainer.displayName = "NetworkPopFormContainer"
NetworkPopFormContainer.propTypes = {
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialValues: PropTypes.object,
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  selectedLocationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedPopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  show: PropTypes.bool
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
