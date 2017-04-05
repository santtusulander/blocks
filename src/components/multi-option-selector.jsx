import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Panel, Table } from 'react-bootstrap'
import classNames from 'classnames'

import Checkbox from './shared/form-elements/checkbox'
import Toggle from './shared/form-elements/toggle'

class MultiOptionSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openPanels: []
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
  }

  handleCheckboxChange(subOption, option, hasValue, index) {
    const { field } = this.props
    const copy = [...field.value]
    const options = copy.find(opt => opt.id === option.value).options
    if (!hasValue) {
      options.push(subOption.value)
    } else {
      options.splice(index, 1)
    }
    field.onChange(copy)
    this.setState({options: copy})
  }

  handleToggleChange(option, hasValue, index, panel, panelOpen) {
    const { field } = this.props
    const copy = [...field.value]
    if (!hasValue) {
      copy.push({ id: option.value, options: option.options.map(opt => opt.value) })
      if (!panelOpen) {
        this.togglePanel(panel)
      }
    } else {
      copy.splice(index, 1)
      if (panelOpen) {
        this.togglePanel(panel)
      }
    }
    field.onChange(copy)
    this.setState({toggles: copy})
  }

  togglePanel(panel) {
    const openPanels = this.state.openPanels
    const index = openPanels.indexOf(panel)
    if (index === -1) {
      openPanels.push(panel)
    } else {
      openPanels.splice(index, 1)
    }
    this.setState({ openPanels })
  }

  render() {
    const { disabled, field, intl, options } = this.props
    return (
      <div className="multi-option-selector">
        {options.map((option, i) => {
          const expanded = this.state.openPanels.indexOf(i) >= 0
          const optionIndex = field.value.findKey(fieldOpt => fieldOpt.id === option.value)
          const optionValue = optionIndex >= 0
          return (
            <div className="multi-option-panel" key={`option-${i}`}>
              <div
                className={classNames(
                  'multi-option-header',
                  'clearfix',
                  {'active': optionValue}
                )}
                onClick={() => this.togglePanel(i)}>
                <div>
                  {option.label}
                  <Toggle
                    className={classNames(
                      'right',
                      {'inverted-style': optionValue}
                    )}
                    changeValue={() => this.handleToggleChange(option, optionValue, optionIndex, i, expanded)}
                    onText={intl.formatMessage({id: 'portal.common.ON.text'})}
                    offText={intl.formatMessage({id: 'portal.common.OFF.text'})}
                    value={optionValue}
                    readonly={disabled}/>
                </div>
              </div>
              <Panel collapsible={true} expanded={expanded}>
                <Table striped={true}>
                  <tbody>
                    {option.options.map((subOption, j) => {
                      const subOptions = field.value.find(fieldOpt => fieldOpt.id === option.value)
                      const subOptionIndex = subOptions ? subOptions.options.indexOf(subOption.value) : -1
                      const subOptionValue = subOptionIndex >= 0
                      return (
                        <tr key={`option-${i}-${j}`}>
                          <td>
                            <Checkbox
                              disabled={!optionValue}
                              checked={subOptionValue}
                              onChange={() => this.handleCheckboxChange(subOption, option, subOptionValue, subOptionIndex)}>
                              {subOption.label}
                            </Checkbox>
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

MultiOptionSelector.displayName = 'MultiOptionSelector'
MultiOptionSelector.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  options: PropTypes.array
}
MultiOptionSelector.defaultProps = {
  disabled: false,
  options: []
}

export default injectIntl(MultiOptionSelector)
