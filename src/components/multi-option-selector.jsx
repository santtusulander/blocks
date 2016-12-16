import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Input, Panel, Table } from 'react-bootstrap'

import Toggle from './toggle'

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
  }

  togglePanel(panel) {
    let openPanels = this.state.openPanels
    const index = openPanels.indexOf(panel)
    if (index === -1) {
      openPanels.push(panel)
    } else {
      openPanels.splice(index, 1)
    }
    this.setState({ openPanels })
  }

  render() {
    const { field, intl, options } = this.props
    return (
      <div className="multi-option-selector">
        {options.map((option, i) => {
          const expanded = this.state.openPanels.indexOf(i) >= 0
          const optionIndex = field.value.findIndex(fieldOpt => fieldOpt.id === option.value)
          const optionValue = optionIndex >= 0
          return (
            <div className="multi-option-panel" key={`option-${i}`}>
              <div
                className="multi-option-header clearfix"
                onClick={() => this.togglePanel(i)}>
                <div>
                  {option.label}
                  <Toggle
                    className="right"
                    changeValue={() => this.handleToggleChange(option, optionValue, optionIndex, i, expanded)}
                    onText={intl.formatMessage({id: 'portal.common.ON.text'})}
                    offText={intl.formatMessage({id: 'portal.common.OFF.text'})}
                    value={optionValue}/>
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
                            <Input
                              type="checkbox"
                              disabled={!optionValue}
                              checked={subOptionValue}
                              label={subOption.label}
                              onChange={() => this.handleCheckboxChange(subOption, option, subOptionValue, subOptionIndex)}/>
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
  field: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  options: PropTypes.array
}
MultiOptionSelector.defaultProps = {
  options: []
}

export default injectIntl(MultiOptionSelector)
