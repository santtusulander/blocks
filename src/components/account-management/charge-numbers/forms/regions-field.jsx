import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { InputGroup, FormControl } from 'react-bootstrap'
import Checkbox from '../../../checkbox'

class RegionsField extends React.Component {
  constructor(props) {
    super(props)

    this.handleChangeRegion = this.handleChangeRegion.bind(this)
    this.handleChangeChargeNumber = this.handleChangeChargeNumber.bind(this)
  }

  componentWillMount() {
    const { iterable, input } = this.props

    iterable.forEach(checkbox => {
      this.setState({[checkbox.value]:  input.value.find(item => item.region_code === checkbox.value) || ''})
    })
  }

  handleChangeRegion (option, hasValue, index, e) {
    const { input } = this.props
    const copy = [...input.value]

    if (!hasValue && e.target.checked) {
      input.onChange(copy.concat({region_code: option.value, charge_number: ''}))
    } else if (!event.target.checked) {
      copy.splice(index, 1)
      input.onChange(copy)
    }
  }

  handleChangeChargeNumber (region, value) {
    const { input } = this.props
    const copy = [...input.value]

    copy.forEach(item => {
      if (item.region_code === region) {
        item.charge_number = value
      }
    })

    input.onChange(copy)
  }

  render() {
    const { iterable, input } = this.props
    const regions = input.value.map(item => item.region_code)

    return (
      <div>
        {iterable.map((checkbox, i) => {
          const index = regions.indexOf(checkbox.value)
          const hasValue = index >= 0

          return (
            <div key={i} className={''}>
              <InputGroup>
                <Checkbox
                  checked={hasValue}
                  onChange={e => this.handleChangeRegion(checkbox, hasValue, index, e)}
                >
                  {checkbox.label}
                </Checkbox>

                <FormControl
                  value={this.state[checkbox.value].charge_number}
                  type='text'
                  onChange={e => this.handleChangeChargeNumber(checkbox.value, e.target.value)}
                />
              </InputGroup>
            </div>
          )
        })}
      </div>
    )
  }
}
RegionsField.displayName = 'RegionsField'

RegionsField.propTypes = {
  input: PropTypes.object,
  iterable: PropTypes.array
}

export default injectIntl(RegionsField)
