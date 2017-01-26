import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { reduxForm, Field} from 'redux-form'
import { fromJS } from 'immutable'

import FieldFormGroup from '../../../form/field-form-group'
import FieldFormGroupCheckboxes from '../../../form/field-form-group-checkboxes'

import ChargeNumbersField from './charge-numbers-field'

import { FLOW_DIRECTION_TYPES } from '../../../../constants/account-management-options'

const validate = () => {
  return true
}

class AddChargeNumbersForm extends React.Component {
  constructor(props) {
    super(props)
  }

  onEnable(data) {
    const value = this.props.activeServiceItem.mergeDeep(fromJS(data))

    this.props.onSubmit(value)
  }

  render() {
    const { hasFlowDirection, hasRegionalBilling, onDisable, onCancel } = this.props

    return (
      <form
        onSubmit={this.props.handleSubmit(this.onEnable.bind(this))}
      >
        { hasFlowDirection && 
          <Field
            name="flow_direction"
            component={FieldFormGroupCheckboxes}
            iterable={FLOW_DIRECTION_TYPES}
            required={false}
            label={'Flow Directions'}
          />
        }

        { hasRegionalBilling && 
          <div>
            <Field
              name={'billing_meta'}
              component={ChargeNumbersField}
            />
          </div>
        }

        { !hasRegionalBilling && 
          <Field
            type="text"
            name={'billing_meta.charge_number'}
            component={FieldFormGroup}
            label={'Global Charge Number'}
          />
        }

        <ButtonToolbar className="text-right extra-margin-top">
           <Button
            id='disable-button'
            bsStyle="primary"
            onClick={onDisable}
          >
            <FormattedMessage id='portal.common.button.disable' />
          </Button>
          <Button
            id='cancel-button'
            className="btn-outline"
            onClick={onCancel}
          >
            <FormattedMessage id='portal.common.button.cancel' />
          </Button>
          <Button
            id='submit-button'
            type='submit'
            bsStyle="primary"
          >
            <FormattedMessage id='portal.common.button.enable' />
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

AddChargeNumbersForm.displayName = 'AddChargeNumbersForm'
AddChargeNumbersForm.propTypes = {
  //activeServiceItem: PropTypes.instanceOf(Map),
  handleSubmit: PropTypes.func,
  hasFlowDirection: PropTypes.bool,
  hasRegionalBilling: PropTypes.bool,
  onCancel: PropTypes.func,
  onDisable: PropTypes.func,
  onSubmit: PropTypes.func
}

export default reduxForm({
  form: 'AddChargeNumbersForm',
  validate
})(injectIntl(AddChargeNumbersForm))
