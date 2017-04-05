import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import Typeahead from '../../typeahead'
import { getReduxFormValidationState } from '../../../util/helpers'

const FieldFormGroupTypeahead = ({
  allowNew = false,
  asyncMode,
  className,
  disabled,
  emptyLabel,
  input,
  intl,
  label,
  meta, meta: { dirty, error, touched },
  multiple = false,
  minLength,
  delay,
  useCache,
  newSelectionPrefix,
  options,
  placeholder,
  required = true,
  filterBy,
  labelKey,
  onChange,
  onSearch,
  validation
}) => {

  /* eslint-disable react/no-multi-comp */
  /* eslint-disable react/display-name */
  const renderToken = (token, onRemove, key) => {

    // Add validation classes to rendered tokens if custom validation rule is defined
    const validationClass = (validation) ? validation(token) ? 'valid' : 'invalid' : ''

    return (
      <div className={classNames('token token-removeable', `token__${validationClass}`)} key={key}>
        {token.label}
        <span className="close-button" role="button" onClick={onRemove}>×</span>
      </div>
    )
  }

  const selectedValues = () => {
    if (input.value) {
      return Array.isArray(input.value) ? input.value : [input.value]
    }

    return []
  }

  return (
    <FormGroup
      className={classNames('typeahead-form-group', {'has-error': error && dirty}, className)}
      controlId={input.name}
      validationState={getReduxFormValidationState(meta)}>

      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}

      <Typeahead
        {...input}
        allowNew={allowNew}
        asyncMode={asyncMode}
        className={classNames({disabled: disabled}, className)}
        disabled={disabled}
        filterBy={filterBy}
        labelKey={labelKey}
        emptyLabel={emptyLabel ? emptyLabel : intl.formatMessage({ id: 'portal.common.typeahead.emptyLabel' })}
        multiple={multiple}
        minLength={minLength}
        delay={delay}
        useCache={useCache}
        newSelectionPrefix={newSelectionPrefix ? newSelectionPrefix : intl.formatMessage({ id: 'portal.common.typeahead.newSelectionPrefix' })}
        placeholder={placeholder}
        onChange={onChange ? (selected) => onChange(selected) : e => input.onChange(e)}
        onSearch={onSearch}
        onBlur={() => input.onBlur(input.value)}
        options={options}
        selected={selectedValues()}
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
  asyncMode: PropTypes.bool,
  className: PropTypes.string,
  delay: PropTypes.number,
  disabled: PropTypes.bool,
  emptyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  filterBy: PropTypes.oneOfType([ PropTypes.string, PropTypes.func, PropTypes.array ]),
  input: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelKey: PropTypes.string,
  meta: PropTypes.object,
  minLength: PropTypes.number,
  multiple: PropTypes.bool,
  newSelectionPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  useCache: PropTypes.bool,
  validation: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
}

export default injectIntl(FieldFormGroupTypeahead)
