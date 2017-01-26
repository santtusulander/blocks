import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl'
import Typeahead from 'react-bootstrap-typeahead'
import classNames from 'classnames'

import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupTypeahead = ({
  allowNew = false,
  className,
  disabled,
  emptyLabel,
  input,
  intl,
  label,
  meta, meta: { touched, error },
  multiple = false,
  newSelectionPrefix,
  options,
  required = true,
  filterBy,
  labelKey,
  validation
}) => {

  /* eslint-disable react/no-multi-comp */
  /* eslint-disable react/display-name */
  const renderToken = (token, onRemove, key) => {

    // Add validation classes to rendered tokens id custom validation rule is defined
    const validationClass = (validation) ? validation(token) ? 'valid' : 'invalid' : 'valid'

    return (
      <div className={classNames('token token-removeable', `token__${validationClass}`)} key={key}>
        {token.label}
        <span className="close-button" role="button" onClick={onRemove}>×</span>
      </div>
    )
  }

  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <Typeahead
        {...input}
        allowNew={allowNew}
        className={className}
        disabled={disabled}
        filterBy={filterBy}
        labelKey={labelKey}
        emptyLabel={emptyLabel ? emptyLabel : intl.formatMessage({ id: 'portal.common.typeahead.emptyLabel' })}
        multiple={multiple}
        newSelectionPrefix={newSelectionPrefix ? newSelectionPrefix : intl.formatMessage({ id: 'portal.common.typeahead.newSelectionPrefix' })}
        onChange={e => input.onChange(e)}
        options={options}
        renderToken={renderToken}
      />

      {error && touched &&
      <HelpBlock className='error-msg'>{error}</HelpBlock>
      }
    </FormGroup>
  );
}

FieldFormGroupTypeahead.displayName = 'FieldFormGroupTypeahead'
FieldFormGroupTypeahead.defaultProps = {
  validation: false
}
FieldFormGroupTypeahead.propTypes = {
  allowNew: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emptyLabel: PropTypes.string,
  filterBy: PropTypes.oneOfType([ PropTypes.string, PropTypes.func, PropTypes.array ]),
  input: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelKey: PropTypes.string,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
  newSelectionPrefix: PropTypes.string,
  options: PropTypes.array,
  required: PropTypes.bool,
  validation: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
}

export default injectIntl(FieldFormGroupTypeahead)
