import React, { PropTypes } from 'react'

import { injectIntl } from 'react-intl'
import { Field} from 'redux-form'

import Select from '../../../select.jsx'

import { getLocationTypeFromBillingMeta } from '../../../../util/services-helpers'

import FieldFormGroup from '../../../form/field-form-group'
import RegionsField from './regions-field'

import { CHARGE_ALLOCATION_TYPES, REGIONS_TYPES} from '../../../../constants/account-management-options'

class ChargeNumbersField extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount () {
    const locationType = getLocationTypeFromBillingMeta(this.props.input.value)

    this.setState({ locationType });
  }

  onChangeLocation (locationType, input) {
    this.setState({locationType});

    if (locationType === 'region') {
      input.value.charge_number = null
      input.value.regions = []
    }

    if (locationType === 'global') {
      input.value.regions = null
      input.value.charge_number = ''
    }
  }

  render() {
    const { input } = this.props

    return (
      <div>
        <Select
          value={this.state.locationType}
          className="input-select"
          onSelect={val => this.onChangeLocation(val, input)}
          options={CHARGE_ALLOCATION_TYPES}
        />

          { this.state.locationType === 'region' &&
            <Field
              name="billing_meta.regions"
              component={RegionsField}
              iterable={REGIONS_TYPES}
            />
          }

          { this.state.locationType === 'global' &&
            <Field
              type="text"
              name={'billing_meta.charge_number'}
              component={FieldFormGroup}
              label={'Global Charge Number'}
            />
          }
      </div>
    )
  }
}

ChargeNumbersField.displayName = 'ChargeNumbersField'

ChargeNumbersField.propTypes = {
  input: PropTypes.object
}

export default injectIntl(ChargeNumbersField)
