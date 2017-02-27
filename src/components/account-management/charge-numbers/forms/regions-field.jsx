import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FormControl, FormGroup, ControlLabel, InputGroup } from 'react-bootstrap'
import DefaultErrorBlock from '../../../form/default-error-block'
import Checkbox from '../../../checkbox'

class RegionsField extends React.Component {
  constructor(props) {
    super(props)

    this.handleChangeRegion = this.handleChangeRegion.bind(this)
    this.handleChangeChargeNumber = this.handleChangeChargeNumber.bind(this)
    this.renderRegionItem = this.renderRegionItem.bind(this)
  }

  componentWillMount() {
    const { iterable, fields } = this.props
    const values = fields.getAll() || []

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

  handleChangeChargeNumber (region_code, charge_num, index) {
    const { fields } = this.props
    const charge_number = charge_num.toUpperCase()

    fields.remove(index)
    fields.insert(index, {region_code, charge_number})

    this.setState({[region_code]: charge_number})
  }

  renderRegionItem (regions, item, i) {
    const index = regions.indexOf(item.value)
    const hasValue = index >= 0

    return (
      <div key={i}>
        <br/>
        <FormGroup>
          <Checkbox
            checked={hasValue}
            onChange={e => this.handleChangeRegion(item, hasValue, index, e)}
          >
            <span>{item.label}</span>
          </Checkbox>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon><FormattedMessage id="portal.account.chargeNumbersForm.charge_number.title" /></InputGroup.Addon>
              <FormControl
                value={this.state[item.value]}
                disabled={!hasValue}
                type='text'
                onChange={e => this.handleChangeChargeNumber(item.value, e.target.value, index)}
              />
            </InputGroup>
          </FormGroup>
        </FormGroup>
      </div>
    )
  }

  render() {
    const { iterable, fields, label, required = true, meta: { error, dirty } } = this.props
    const allFields = fields.getAll() || []
    const regions = allFields.map(item => item.region_code)

    return (
      <FormGroup>
        {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
        {iterable.map((item, i) => {
          return this.renderRegionItem(regions, item, i)
        })}
        {error && dirty && <p className='has-error'><DefaultErrorBlock error={error}/></p>}
      </FormGroup>
    )
  }
}

RegionsField.defaultProps = {
  iterable: []
}

RegionsField.displayName = 'RegionsField'

RegionsField.propTypes = {
  fields: PropTypes.object,
  iterable: PropTypes.array,
  label: PropTypes.object,
  meta: PropTypes.object,
  required: PropTypes.bool
}

export default injectIntl(RegionsField)
