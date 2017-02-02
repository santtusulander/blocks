import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FormControl, FormGroup, ControlLabel, InputGroup } from 'react-bootstrap'
import Checkbox from '../../../checkbox'

class RegionsField extends React.Component {
  constructor(props) {
    super(props)

    this.handleChangeRegion = this.handleChangeRegion.bind(this)
    this.handleChangeChargeNumber = this.handleChangeChargeNumber.bind(this)
  }

  componentWillMount() {
    const { iterable, fields } = this.props
    const values = fields.getAll()

    iterable.forEach(checkbox => {
      const region = values.find(item => item.region_code === checkbox.value)
      this.setState({[checkbox.value]: region ? region.charge_number : ''})
    })
  }

  handleChangeRegion (option, hasValue, index, e) {
    const { fields } = this.props

    if (!hasValue && e.target.checked) {
      fields.insert(index, {region_code: option.value, charge_number: ''})
    } else if (!e.target.checked) {
      fields.remove(index)

      this.setState({[option.value]: ''})
    }
  }

  handleChangeChargeNumber (region_code, charge_number, index) {
    const { fields } = this.props

    fields.remove(index)
    fields.insert(index, {region_code, charge_number})

    this.setState({[region_code]: charge_number})
  }

  render() {
    const { iterable, fields, label, required = true } = this.props
    const values = fields.getAll()
    const regions = values.map(item => item.region_code)

    return (
      <FormGroup>
        {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
        {iterable.map((checkbox, i) => {
          const index = regions.indexOf(checkbox.value)
          const hasValue = index >= 0

          return (
            <div key={i}>
              <br/>
              <FormGroup>
                <Checkbox
                  checked={hasValue}
                  onChange={e => this.handleChangeRegion(checkbox, hasValue, index, e)}
                >
                  <span>{checkbox.label}</span>
                </Checkbox>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon><FormattedMessage id="portal.account.chargeNumbersForm.charge_number.title" /></InputGroup.Addon>
                    <FormControl
                      value={this.state[checkbox.value]}
                      disabled={!hasValue}
                      type='text'
                      onChange={e => this.handleChangeChargeNumber(checkbox.value, e.target.value, index)}
                    />
                  </InputGroup>
                </FormGroup>
              </FormGroup>
            </div>
          )
        })
      }
    </FormGroup>
    )
  }
}

RegionsField.displayName = 'RegionsField'

RegionsField.propTypes = {
  fields: PropTypes.object,
  iterable: PropTypes.array,
  label: PropTypes.object,
  required: PropTypes.bool
}

export default injectIntl(RegionsField)
