import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap'
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
      const region = input.value.find(item => item.region_code === checkbox.value)
      this.setState({[checkbox.value]: region ? region.charge_number : ''})
    })
  }

  handleChangeRegion (option, hasValue, index, e) {
    const { input } = this.props
    const copy = [...input.value]

    if (!hasValue && e.target.checked) {
      input.onChange(copy.concat({region_code: option.value, charge_number: ''}))
    } else if (!e.target.checked) {
      copy.splice(index, 1)
      input.onChange(copy)
      this.setState({[option.value]: ''})
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
    this.setState({[region]: value})
  }

  render() {
    const { iterable, input } = this.props
    const regions = input.value.map(item => item.region_code)

    return (
      <div>
        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.account.chargeNumbersForm.regions.title"/></ControlLabel>

            {iterable.map((checkbox, i) => {
              const index = regions.indexOf(checkbox.value)
              const hasValue = index >= 0

              return (
                <div key={i}>
                  <Checkbox
                    checked={hasValue}
                    onChange={e => this.handleChangeRegion(checkbox, hasValue, index, e)}
                  >
                    <span>{checkbox.label}</span>
                  </Checkbox>

                  <div className="form-inline region-charge-number">
                    <FormattedMessage id="portal.account.chargeNumbersForm.charge_number.title"/>
                    &nbsp;&nbsp;
                    <FormControl
                      value={this.state[checkbox.value]}
                      disabled={!hasValue}
                      type='text'
                      onChange={e => this.handleChangeChargeNumber(checkbox.value, e.target.value)}
                      bsSize="small"
                    />
                  </div>
                </div>
              )
            })
          }
        </FormGroup>
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
