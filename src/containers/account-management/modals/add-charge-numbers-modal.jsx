import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import SidePanel from '../../../components/side-panel'
import ChargeNumbersForm from '../../../components/account-management/charge-numbers/forms/add-charge-numbers-form'

import { getServiceById, getOptionById } from '../../../util/services-helpers'

class AddChargeNumbersModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { activeServiceItem, onSubmit, onDisable, onCancel, servicesInfo, show, initialValues } = this.props
    let itemDetails = Map()
    let isService = null

    if (activeServiceItem.size) {
      isService = activeServiceItem.has('service_id')
      itemDetails = isService 
                    ? getServiceById(servicesInfo, activeServiceItem.get('service_id'))
                    : getOptionById(servicesInfo, activeServiceItem.get('option_id'))
    }

    return (
      <div>
        { activeServiceItem.size &&
          <SidePanel
            show={show}
            title={itemDetails.get('name')}
            subTitle={isService ? 'SERVICE' : 'OPTION'}
            cancel={onCancel}
            className="on-top-side-panel"
          >
            <ChargeNumbersForm 
              initialValues={initialValues}
              activeServiceItem={activeServiceItem}
              hasFlowDirection={isService}
              hasRegionalBilling={itemDetails.get('supports_regional_billing')}
              onCancel={onCancel}
              onDisable={onDisable}
              onSubmit={onSubmit}
            />
          </SidePanel>
        }
      </div>
    )
  }
}

AddChargeNumbersModal.displayName = 'AddChargeNumbersModal'
AddChargeNumbersModal.propTypes = {
  activeServiceItem: PropTypes.instanceOf(Map), 
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onDisable: PropTypes.func,
  onSubmit: PropTypes.func,
  servicesInfo: PropTypes.object,
  show: PropTypes.bool
}

function mapStateToProps(state, props) {
  return {
    initialValues: {
      flow_direction: props.activeServiceItem && props.activeServiceItem.get('flow_direction')
                      && props.activeServiceItem.get('flow_direction').toJS(),
      billing_meta: props.activeServiceItem && props.activeServiceItem.get('billing_meta')
                    && props.activeServiceItem.get('billing_meta').toJS()
    },
    servicesInfo: state.serviceInfo && state.serviceInfo.services
  }
}

export default connect(mapStateToProps)(
  injectIntl(AddChargeNumbersModal)
)

