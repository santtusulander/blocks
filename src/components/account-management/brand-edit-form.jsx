import React from 'react'
import { FormGroup, ControlLabel, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { connect } from 'react-redux'

import SidePanel from '../side-panel'
import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import Radio from '../../components/radio'

import './brand-edit-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const colorThemeOptions = [
  { id: '1', themeName: 'Theme Name 1' },
  { id: '2', themeName: 'Theme Name 2' },
  { id: '3', themeName: 'Theme Name 3' }
].map((e) => {
  return [ e.id, e.themeName]
});

let errors = {}

const validate = (values) => {
  errors = {}

  const { brandName } = values

  if (!brandName || brandName.length === 0) {errors.brandName = 'brandName is required'}

  return errors;
}

const BrandEditForm = (props) => {

  const title = props.edit ? <FormattedMessage id="portal.brand.edit.editBrand.title"/> : <FormattedMessage id="portal.brand.edit.newBrand.title"/>
  const actionButtonTitle = props.edit ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>
  const onSubmit = () => {
    // TODO: Implement form data submission
  }
  return (
      <SidePanel
        show={true}
        title={title}
        className="brand-edit-form-sidebar"
        subTitle="PLACEHOLDER"
        cancel={() => {
          // no-op
        }}>

        <form onSubmit={props.handleSubmit(onSubmit)}>

          <Field
            name="brandName"
            id="name-field"
            placeholder={props.intl.formatMessage({id: 'portal.brand.edit.brandName.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.brand.edit.brandName.text" />}/>

        <hr/>

        <div className='udn-file-input'>
          <Field
            name="brandLogo"
            id='brand-input'
            type='file'
            placeholder={props.intl.formatMessage({id: 'portal.brand.edit.logo.placeholder'})}
            addonAfter=' ICO, GIF or PNG'
            className='input-file'
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.brand.edit.logo.text" />}/>
        </div>

        <hr/>

        <div className='udn-file-input'>
          <Field
            name="favicon"
            id='favicon-input'
            type='file'
            placeholder={props.intl.formatMessage({id: 'portal.brand.edit.favicon.placeholder'})}
            addonAfter={props.intl.formatMessage({id: 'portal.brand.edit.favicon.addonAfter'})}
            className='input-file'
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.brand.edit.favicon.text" />}/>
        </div>

        <hr/>

          <Field
            name="colorTheme"
            id='theme-input'
            className='input-select'
            options={colorThemeOptions}
            component={FieldFormGroupSelect}
            label={<FormattedMessage id="portal.brand.edit.chooseColorTheme.text"/>}/>

        <hr/>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.brand.edit.availability.text"/></ControlLabel>

          <Field
            name="availability"
            type="radio"
            component={Radio}
            value='private'>
            <FormattedMessage id="portal.brand.edit.availability.private.label" />
          </Field>

          <Field
            name="availability"
            type="radio"
            component={Radio}
            value='public'>
            <FormattedMessage id="portal.brand.edit.availability.public.label" />
          </Field>

          </FormGroup>
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button disabled={props.submitting || props.invalid} bsStyle="primary" type="submit" >{actionButtonTitle}</Button>
        </ButtonToolbar>
      </form>
  </SidePanel>

  )
}

BrandEditForm.displayName = 'BrandEditForm'

BrandEditForm.propTypes = {
  edit: React.PropTypes.bool,
  intl: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  ...reduxFormPropTypes
}

function mapStateToProps() {
  return { }
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'brand-edit',
    validate
  })(injectIntl(BrandEditForm))
)
