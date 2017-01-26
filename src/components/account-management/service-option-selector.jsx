import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Panel, Table } from 'react-bootstrap'
import classNames from 'classnames'
import { fromJS, List } from 'immutable'

import IconHeaderCaret from '../icons/icon-header-caret'
import IconArrowRight from '../icons/icon-arrow-right'

class ServiceOptionSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openPanels: []
    }

    this.changeOptionValue = this.changeOptionValue.bind(this)
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
  }

  changeOptionValue(serviceId, optionId, hasValue, serviceIndex, optionIndex) {
    const { input } = this.props
    const copy = input.value.toJS()
    const options = copy[serviceIndex].options

    if (!hasValue) {
      options.push({ option_id: optionId })
    } else {
      options.splice(optionIndex, 1)
    }
    input.onChange(fromJS(copy))
    this.props.onChangeServiceItem(fromJS(copy))
    //this.setState({options: copy})
  }

  handleOptionClick (option, serviceId, optionId, optionValue, serviceIndex, optionIndex, callback) {
    if (typeof serviceIndex === 'undefined') {
      return false
    }
 
    if(option.requires_charge_number) {
      this.props.showServiceItemForm(serviceId, optionId, callback)
    } else {
      this.changeOptionValue(serviceId, optionId, optionValue, serviceIndex, optionIndex)
    }
  }

  togglePanel(index) {
    let openPanels = this.state.openPanels

    if (openPanels.indexOf(index) === -1) {
      openPanels.push(index)
    } else {
      openPanels.splice(index, 1)
    }
    this.setState({ openPanels })
  }

  render() {
    const { options, input } = this.props
    const servicesIds = input.value.map(item => item.get('service_id'))

    return (
      <div className="multi-option-selector service-option-selector">
          {options.map((option, i) => {
            const expanded = this.state.openPanels.indexOf(i) >= 0
            const serviceIndex = servicesIds.findKey(fieldOpt => fieldOpt === option.value)
            const optionValue = serviceIndex >= 0

            return (
              <div key={`option-${i}`} className="multi-option-panel">
                <div
                  className={classNames(
                    'multi-option-header',
                    'flex-row',
                    {'active': optionValue}
                  )}
                  onClick={() => this.togglePanel(i)}
                >
                  <div className="flex-item tick">{optionValue ? <IconHeaderCaret /> : ''}</div>
                  <div className="flex-item">{option.label}</div>
                  <div className="flex-item">{optionValue ? 'ENABLED' : 'disabled'}</div>
                  <div className="flex-item arrow-right">
                    {option.requires_charge_number
                      ? <a
                          className="btn btn-icon btn-transparent"
                          onClick={() => this.props.showServiceItemForm(option.value, null, input.onChange)}
                        >
                          <IconArrowRight />
                        </a>
                      : ''
                    }
                  </div>
                </div>
                <Panel collapsible={true} expanded={expanded}>
                  <Table striped={true} className="table-simple">
                    <tbody>
                      {option.options.map((subOption, j) => {
                        const options = serviceIndex >= 0 ? input.value.get(serviceIndex).get('options') : List()
                        const subOptionsIds = options.map(item => item.get('option_id'))
                        const subOptionIndex = subOptionsIds ? subOptionsIds.indexOf(subOption.value) : -1
                        const subOptionValue = subOptionIndex >= 0

                        return (
                          <tr
                            key={`option-${i}-${j}`}
                            onClick={() => this.handleOptionClick(subOption, option.value, subOption.value, subOptionValue, serviceIndex, subOptionIndex, input.onChange)}
                          >
                            <td className="flex-row">
                              <div className="flex-item tick">{subOptionValue ? <IconHeaderCaret /> : ''}</div>
                              <div className="flex-item">{subOption.label}</div>
                              <div className="flex-item">{subOptionValue ? 'ENABLED' : 'disabled'}</div>
                              <div className="flex-item arrow-right">
                                {subOption.requires_charge_number
                                  ? <IconArrowRight />
                                  : ''
                                }
                              </div>
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
    )
  }
}

ServiceOptionSelector.displayName = 'ServiceOptionSelector'
ServiceOptionSelector.propTypes = {
  input: PropTypes.object.isRequired,
  onChangeServiceItem: PropTypes.func,
  options: PropTypes.array,
  showServiceItemForm: PropTypes.func
}

ServiceOptionSelector.defaultProps = {
  options: []
}

export default injectIntl(ServiceOptionSelector)
