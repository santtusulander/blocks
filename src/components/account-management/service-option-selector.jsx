import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Panel, Table, FormGroup, ControlLabel } from 'react-bootstrap'
import classNames from 'classnames'
import { fromJS, List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import IconCheck from '../shared/icons/icon-check'
import IconChevronRight from '../shared/icons/icon-chevron-right'
import IconChevronRightBold from '../shared/icons/icon-chevron-right-bold'

class ServiceOptionSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openPanels: []
    }

    this.changeValue = this.changeValue.bind(this)
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.handleServiceClick = this.handleServiceClick.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
    this.renderFlexRowItem = this.renderFlexRowItem.bind(this)
  }

  changeValue (serviceId, optionId, hasValue, serviceIndex, optionIndex) {
    if (!serviceId) {
      return false
    }

    const { input, onChangeServiceItem } = this.props
    const copy = input.value.toJS()

    if (optionId) {
      const options = copy[serviceIndex].options

      if (!hasValue) {
        options.push({ option_id: optionId })
      } else {
        options.splice(optionIndex, 1)
      }
    } else {
      if (!hasValue) {
        copy.push({ service_id: serviceId, options: [] })
      } else {
        copy.splice(serviceIndex, 1)
      }
    }

    input.onChange(fromJS(copy))
    onChangeServiceItem(fromJS(copy))
  }

  handleOptionClick (option, serviceId, optionId, optionValue, serviceIndex, optionIndex, callback) {
    if (typeof serviceIndex === 'undefined') {
      return false
    }

    if (option.requires_charge_number) {
      this.props.showServiceItemForm(serviceId, optionId, callback, optionValue)
    } else {
      this.changeValue(serviceId, optionId, optionValue, serviceIndex, optionIndex)
    }
  }

  handleServiceClick (isEnabled, itemInfo, index, serviceIndex) {
    return () => {
      if (itemInfo.options.length) {
        this.togglePanel(index)
      }

      if (!itemInfo.requires_charge_number) {
        this.changeValue(itemInfo.value, null, isEnabled, serviceIndex)
      }
    }
  }

  togglePanel (index) {
    const openPanels = this.state.openPanels
    const panelIndex = openPanels.indexOf(index)
    if (panelIndex === -1) {
      openPanels.push(index)
    } else {
      openPanels.splice(panelIndex, 1)
    }
    this.setState({ openPanels })
  }

  renderFlexRowItem (itemIndex, isEnabled, itemInfo, regions, isService, index, onChangeCallback) {
    return (
      <div
        className={classNames(
          {'multi-option-header': isService},
          'flex-row',
          {'active': isEnabled && isService},
          {'enabled': isEnabled}
        )}
        onClick={isService && this.handleServiceClick(isEnabled, itemInfo, index, itemIndex)}
      >
        <div className="tick">{isEnabled ? <IconCheck /> : ''}</div>
        <div className="name">{itemInfo.label}</div>
        <div className="flex-item">{regions && regions.size ? `${regions.size} regions` : ''}</div>
        <div className="flex-item">{isEnabled
                                    ? <FormattedMessage id='portal.account.chargeNumbersForm.enabled.title'/>
                                    : <FormattedMessage id='portal.account.chargeNumbersForm.disabled.title'/>}
        </div>
        <div className="flex-item arrow-right">
          {itemInfo.requires_charge_number
            ? <a
                className="btn btn-icon btn-transparent"
                onClick={(e) => {
                  if (isService) {
                    e.stopPropagation()
                    this.props.showServiceItemForm(itemInfo.value, null, onChangeCallback, isEnabled)
                  }
                }}
              >
                {isEnabled ? <IconChevronRightBold /> : <IconChevronRight />}
              </a>
            : ''
          }
        </div>
      </div>
    )
  }

  render() {
    const { options, input, label, required } = this.props
    const servicesIds = input.value.map(item => item.get('service_id'))

    return (
      <FormGroup>
        {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
        <div className="multi-option-selector service-option-selector">
          {options.map((option, i) => {
            const expanded = this.state.openPanels.indexOf(i) >= 0
            const serviceIndex = servicesIds.findKey(fieldOpt => fieldOpt === option.value)
            const optionValue = serviceIndex >= 0
            const serviceRegions = (optionValue && option.requires_charge_number)
                                   ? input.value.get(serviceIndex).get('billing_meta').get('regions')
                                   : List()

            return (
              <div
                key={`option-${i}`}
                className="multi-option-panel"
              >
                {this.renderFlexRowItem(serviceIndex, optionValue, option, serviceRegions, true, i, input.onChange)}

                <Panel collapsible={true} expanded={expanded}>
                  <Table striped={true} className="table-simple">
                    <tbody>
                      {option.options.map((subOption, j) => {
                        const inputOptions = serviceIndex >= 0 ? input.value.get(serviceIndex).get('options') : List()
                        const subOptionsIds = inputOptions.map(item => item.get('option_id'))
                        const subOptionIndex = subOptionsIds ? subOptionsIds.indexOf(subOption.value) : -1
                        const subOptionValue = subOptionIndex >= 0
                        const optionRegions = (subOptionValue && subOption.requires_charge_number)
                                              ? inputOptions.get(subOptionIndex).get('billing_meta').get('regions')
                                              : List()

                        return (
                          <tr
                            key={`option-${i}-${j}`}
                            onClick={() => this.handleOptionClick(subOption, option.value, subOption.value, subOptionValue, serviceIndex, subOptionIndex, input.onChange)}
                          >
                            <td>
                              {this.renderFlexRowItem(subOptionIndex, subOptionValue, subOption, optionRegions, false, i, input.onChange)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Panel>
              </div>
            )
          })}
        </div>
      </FormGroup>
    )
  }
}

ServiceOptionSelector.displayName = 'ServiceOptionSelector'
ServiceOptionSelector.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.object,
  onChangeServiceItem: PropTypes.func,
  options: PropTypes.array,
  required: PropTypes.bool,
  showServiceItemForm: PropTypes.func
}

ServiceOptionSelector.defaultProps = {
  options: []
}

export default injectIntl(ServiceOptionSelector)
