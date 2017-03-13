import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage  } from 'react-intl'
import { connect } from 'react-redux'
import { Map, fromJS, List } from 'immutable'

import SidePanel from '../../../components/side-panel'
import ChargeNumbersForm from '../../../components/account-management/charge-numbers/forms/add-charge-numbers-form'
import { getRegionsInfo } from '../../../redux/modules/service-info/selectors'

import { getServiceById, getServiceByOptionId } from '../../../util/services-helpers'
import { MEDIA_DELIVERY_SERVICE_ID } from '../../../constants/account-management-options'

class AddChargeNumbersModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { activeServiceItem, onSubmit, onDisable, onCancel, servicesInfo, show, initialValues, regionsInfo } = this.props
    let itemDetails = Map()
    let isService = null
    let hasFlowDirection = null
    let serviceInfoItem = null

    if (activeServiceItem.size) {
      isService = activeServiceItem.has('service_id')
      hasFlowDirection = isService && activeServiceItem.get('service_id') === MEDIA_DELIVERY_SERVICE_ID
      serviceInfoItem = isService
                        ? getServiceById(servicesInfo, activeServiceItem.get('service_id'))
                        : getServiceByOptionId(servicesInfo, activeServiceItem.get('option_id'))
      itemDetails = isService
                    ? serviceInfoItem
                    : serviceInfoItem.get('options').find(item => item.get('id') === activeServiceItem.get('option_id'))
    }

    const subTitle = isService
                    ? <FormattedMessage id="portal.account.chargeNumbersForm.service.title"/>
                    : <FormattedMessage id="portal.account.chargeNumbersForm.option.title"/>

    return (
      <div>
        { activeServiceItem.size &&
          <SidePanel
            show={show}
            title={itemDetails.get('name')}
            subTitle={subTitle}
            cancel={onCancel}
            overlapping={true}
          >
            <ChargeNumbersForm
              initialValues={initialValues}
              activeServiceItem={activeServiceItem}
              hasFlowDirection={hasFlowDirection}
              isEnabled={this.props.isEnabled}
              hasRegionalBilling={itemDetails.get('supports_regional_billing')}
              hasGlobalBilling={itemDetails.get('supports_global_billing')}
              onCancel={onCancel}
              onDisable={onDisable}
              onSubmit={onSubmit}
              regionsInfo={serviceInfoItem.get('regions').size ? serviceInfoItem.get('regions') : regionsInfo}
            />
          </SidePanel>
        }
      </div>
    )
  }
}

AddChargeNumbersModal.defaultProps = {
  activeServiceItem: Map()
}

AddChargeNumbersModal.displayName = 'AddChargeNumbersModal'
AddChargeNumbersModal.propTypes = {
  activeServiceItem: PropTypes.instanceOf(Map),
  initialValues: PropTypes.object,
  isEnabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onDisable: PropTypes.func,
  onSubmit: PropTypes.func,
  regionsInfo: PropTypes.instanceOf(List),
  servicesInfo: PropTypes.object,
  show: PropTypes.bool
}

function mapStateToProps(state, props) {
  return {
    initialValues: {
      billing_meta: props.activeServiceItem && props.activeServiceItem.get('billing_meta')
                    && props.activeServiceItem.get('billing_meta').toJS()
    },
    servicesInfo: state.serviceInfo && state.serviceInfo.services,
    regionsInfo: fromJS(getRegionsInfo(state))
  }
}

export default connect(mapStateToProps)(
  injectIntl(AddChargeNumbersModal)
)
