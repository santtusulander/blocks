import React, { PropTypes } from 'react';
import {FormGroup, HelpBlock } from 'react-bootstrap';
import SortableMultiSelector from '../../sortable-multi-selector'
import { getReduxFormValidationState } from '../../../util/helpers'

const FieldSortableMultiSelector  = ({ input, options, meta: { touched, error },
                                       className, label, required}) => {
  return (
    <FormGroup
      className={className}
      controlId={input.name}
      validationState={getReduxFormValidationState(input)}
    >
      <SortableMultiSelector
        required={required}
        label={label}
        options={options}
        {...input}
      />

      {error && touched &&
        <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldSortableMultiSelector.displayName = 'FieldSortableMultiSelector'
FieldSortableMultiSelector.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array,
  required: PropTypes.bool
}

FieldSortableMultiSelector.defaultProps = {
  required: false,
  options: []
}

export default FieldSortableMultiSelector
