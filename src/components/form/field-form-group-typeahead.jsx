import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import Typeahead from '../typeahead'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldFormGroupTypeahead = ({
  allowNew = false,
  className,
  disabled,
  emptyLabel,
  input,
  intl,
  label,
  meta, meta: { dirty, error },
  multiple = false,
  newSelectionPrefix,
  options,
  placeholder,
  required = true,
  filterBy,
  labelKey,
  onChange,
  validation
}) => {

  /* eslint-disable react/no-multi-comp */
  /* eslint-disable react/display-name */
  const renderToken = (token, onRemove, key) => {

    // Add validation classes to rendered tokens if custom validation rule is defined
    const validationClass = (validation) ? validation(token) ? 'valid' : 'invalid' : 'valid'

    return (
      <div className={classNames('token token-removeable', `token__${validationClass}`)} key={key}>
        {token.label}
        <span className="close-button" role="button" onClick={onRemove}>×</span>
      </div>
    )
  }
  return (
    <FormGroup className={classNames({'has-error': error && dirty})} controlId={input.name} validationState={getReduxFormValidationState(meta)}>
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
        placeholder={placeholder}
        onChange={onChange ? (selected) => onChange(selected) : e => input.onChange(e)}
        onBlur={() => input.onBlur(input.value)}
        options={options}
        selected={Array.isArray(input.value) ? input.value : [input.value]}
        renderToken={renderToken}
      />

    {error &&
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
  emptyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  filterBy: PropTypes.oneOfType([ PropTypes.string, PropTypes.func, PropTypes.array ]),
  input: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelKey: PropTypes.string,
  meta: PropTypes.object,
  multiple: PropTypes.bool,
  newSelectionPrefix: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validation: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
}

export default injectIntl(FieldFormGroupTypeahead)
