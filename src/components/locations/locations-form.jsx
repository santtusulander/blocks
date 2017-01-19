import React, { PropTypes } from 'react'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { checkForErrors } from '../../../util/helpers'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select.jsx'
import FormFooterButtons from '../../form/form-footer-buttons'


