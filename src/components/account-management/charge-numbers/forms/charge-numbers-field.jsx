import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field, FieldArray } from 'redux-form'
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap'

import FieldFormGroup from '../../../form/field-form-group'
import RegionsField from './regions-field'

import { REGIONS_TYPES} from '../../../../constants/account-management-options'
import { getLocationTypeFromBillingMeta } from '../../../../util/services-helpers'

class ChargeNumbersField extends React.Component {
  constructor(props) {
    super(props)

    this.onChangeLocation = this.onChangeLocation.bind(this)
  }

  componentWillMount () {
    const locationType = getLocationTypeFromBillingMeta(this.props.input.value)

    this.setState({ locationType });
  }

  onChangeLocation (locationType, input) {
    this.setState({locationType});

    const copy = {...input.value}

    if (locationType === 'region') {
      delete copy.charge_number
      copy.regions = []
    }

    if (locationType === 'global') {
      delete copy.regions
      copy.charge_number = ''
    }

    input.onChange(copy)
  }

  render() {
    const { input } = this.props

    return (
      <div>
        <FormGroup>
          <ControlLabel>
            <FormattedMessage id="portal.account.chargeNumbersForm.charge_allocation.title"/>
          </ControlLabel>

          <Radio
            value="region"
            checked={this.state.locationType === 'region'}
            onChange={e => this.onChangeLocation(e.target.value, input)}
          >
            <FormattedMessage id="portal.account.chargeNumbersForm.by_region.title"/>
          </Radio>

          <Radio
            value="global"
            checked={this.state.locationType === 'global'}
            onChange={e => this.onChangeLocation(e.target.value, input)}
          >
            <FormattedMessage id="portal.account.chargeNumbersForm.use_global_rate.title"/>
          </Radio>
        </FormGroup>

        <hr/>

        { this.state.locationType === 'region' &&
          <FieldArray
            name="billing_meta.regions"
            component={RegionsField}
            iterable={REGIONS_TYPES}
            label={<FormattedMessage id="portal.account.chargeNumbersForm.regions.title"/>}
            required={false}
          />
        }

        { this.state.locationType === 'global' &&
          <Field
            type="text"
            name="billing_meta.charge_number"
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.account.chargeNumbersForm.charge_number.title" />}
            required={false}
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
