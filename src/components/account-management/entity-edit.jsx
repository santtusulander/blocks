import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { fromJS, List, Map } from 'immutable'

import AccountForm from './account-form'
import GroupFormContainer from '../../containers/account-management/modals/group-form'
import AddChargeNumbersModal from '../../containers/account-management/modals/add-charge-numbers-modal'

import { getDefaultService, getDefaultOption } from '../../util/services-helpers'

class EntityEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entityToUpdate: null,
      activeServiceItem: Map(),
      activeServiceItemPath: null
    }

    this.showServiceItemForm = this.showServiceItemForm.bind(this)
    this.updateServices = this.updateServices.bind(this)
    this.getActiveServiceItem = this.getActiveServiceItem.bind(this)
    this.getActiveServiceItemPath = this.getActiveServiceItemPath.bind(this)
    this.onChangeServiceItem = this.onChangeServiceItem.bind(this)
    this.onDisableServiceItem = this.onDisableServiceItem.bind(this)
  }

  componentWillMount() {
    const { entityToUpdate } = this.props

    this.setState({ entityToUpdate })
  }

  updateServices(path, values) {
    let entity = this.state.entityToUpdate

    if (!entity.get('services')) {
      entity = entity.set('services', List())
    }

    entity = entity.setIn(path, values)

    this.setState({ entityToUpdate: entity })
    this.onServiceChange && this.onServiceChange(entity.get('services'))
  }

  getActiveServiceItem(serviceId, optionId) {
    const services = fromJS(this.state.entityToUpdate.get('services')) || List()
    const service = services.find(item => item.get('service_id') === serviceId) || getDefaultService(serviceId)

    return optionId ? (service.get('options').find(item => item.get('option_id') === optionId) || getDefaultOption(optionId)) : service
  }

  getActiveServiceItemPath(serviceId, optionId) {
    const services = fromJS(this.state.entityToUpdate.get('services')) || List()
    let serviceIndex = services.findKey(item => item.get('service_id') === serviceId)

    if (typeof serviceIndex === 'undefined') {
      serviceIndex = services.size
    }

    const servicePath = ['services', String(serviceIndex)]
    let options = null
    let optionIndex = null

    if (optionId) {
      options = services.get(serviceIndex).get('options')
      optionIndex = options.findKey(item => item.get('option_id') === optionId)
    }

    if (typeof optionIndex === 'undefined') {
      optionIndex = options.size
    }

    return optionId ? servicePath.concat(['options', String(optionIndex)]) : servicePath
  }

  onChangeServiceItem(values) {
    const path = this.state.activeServiceItemPath || ['services']

    this.updateServices(path, values)

    this.setState({
      activeServiceItem: Map(),
      activeServiceItemPath: null
    })
  }

  onDisableServiceItem() {
    const entity = this.state.entityToUpdate.deleteIn(this.state.activeServiceItemPath)

    this.setState({
      entityToUpdate: entity,
      activeServiceItem: Map(),
      activeServiceItemPath: null
    })
    this.onServiceChange && this.onServiceChange(entity.get('services'))
  }

  showServiceItemForm(serviceId, optionId, onChange, isEnabled) {
    this.setState({
      activeServiceItem: this.getActiveServiceItem(serviceId, optionId),
      activeServiceItemPath: this.getActiveServiceItemPath(serviceId, optionId),
      isEnabled
    })
    // callback to update ServiceOptionSelector field from AccountForm
    this.onServiceChange = onChange
  }

  render() {
    const { currentUser, disableDelete, params, type, onSave, onCancel, onDelete } = this.props

    return (
      <div>
      { type === 'account' &&
        <AccountForm
          id="account-form"
          account={this.state.entityToUpdate}
          currentUser={currentUser}
          onCancel={onCancel}
          onChangeServiceItem={this.onChangeServiceItem}
          onSave={onSave}
          showServiceItemForm={this.showServiceItemForm}
          show={true}
        />
      }
      { type === 'group' &&
        <GroupFormContainer
          id="group-form"
          params={params}
          groupId={this.state.entityToUpdate.get('id')}
          onCancel={onCancel}
          onChangeServiceItem={this.onChangeServiceItem}
          onDelete={onDelete}
          onSave={onSave}
          showServiceItemForm={this.showServiceItemForm}
          show={true}
          disableDelete={disableDelete}
        />
      }

        <AddChargeNumbersModal
          activeServiceItem={this.state.activeServiceItem}
          isEnabled={this.state.isEnabled}
          onCancel={() => this.setState({ activeServiceItem: Map(), activeServiceItemPath: null })}
          onDisable={this.onDisableServiceItem}
          onSubmit={this.onChangeServiceItem}
          show={!!this.state.activeServiceItem.size}
        />
      </div>
    )
  }
}

EntityEdit.defaultProps = {
  entityToUpdate: Map()
}

EntityEdit.displayName = 'EntityEdit'
EntityEdit.propTypes = {
  currentUser: PropTypes.instanceOf(Map),
  entityToUpdate: PropTypes.instanceOf(Map),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.object,
  type: PropTypes.string
}

export default injectIntl(EntityEdit)
