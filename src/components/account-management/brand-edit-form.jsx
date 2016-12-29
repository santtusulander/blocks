import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import Radio from '../../components/radio'

import { getReduxFormValidationState } from '../../util/helpers'

import './brand-edit-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const colorThemeOptions = [
  { id: '1', themeName: 'Theme Name 1' },
  { id: '2', themeName: 'Theme Name 2' },
  { id: '3', themeName: 'Theme Name 3' }
].map( (e) => {
  return [ e.id, e.themeName]
});

let errors = {}

const validate = (values) => {
  errors = {}

  const { brandName } = values

  if (!brandName || brandName.length === 0) errors.brandName = 'brandName is required'

  return errors;
}

const BrandEditForm = (props) => {

  const title = props.edit ? <FormattedMessage id="portal.brand.edit.editBrand.title"/> : <FormattedMessage id="portal.brand.edit.newBrand.title"/>
  const actionButtonTitle = props.edit ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>

  const { fields: {brandName, brandLogo, favicon, colorTheme, availability} } = props

  return (
      <SidePanel
        show={true}
        title={title}
        className="brand-edit-form-sidebar"
        subTitle="PLACEHOLDER"
        cancel={props.closeModal}>

        <form onSubmit={props.handleSubmit(props.onSubmit)}>

          <Field
            name="name"
            id="name-field"
            placeholder={props.intl.formatMessage({id: 'portal.brand.edit.brandName.placeholder'})}
            component={FieldFormGroup}>
            <FormattedMessage id="portal.brand.edit.brandName.text" />
          </Field>

        <hr/>

        <div className='udn-file-input'>
          <Field
            name="brandLogo"
            id='brand-input'
            type='file'
            placeholder={props.intl.formatMessage({id: 'portal.brand.edit.logo.placeholder'})}
            addonAfter=' ICO, GIF or PNG'
            className='input-file'
            component={FieldFormGroup}>
            <FormattedMessage id="portal.brand.edit.logo.text" />
          </Field>
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
            component={FieldFormGroup}>
            <FormattedMessage id="portal.brand.edit.favicon.text" />
          </Field>
        </div>

        {/* <UDNFileInput
          {...brandLogo}
          id='brand-input'
          label={this.props.intl.formatMessage({id: 'portal.brand.edit.logo.text'})}
          placeholder={this.props.intl.formatMessage({id: 'portal.brand.edit.logo.placeholder'})}
        />


        <UDNFileInput
          {...favicon}
          id='favicon-input'
          label={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.text'})}
          placeholder={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.placeholder'})}
          addonAfter={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.addonAfter'})}
          className='input-file'
        /> */}

        <hr/>

          <Field
            name="colorTheme"
            id='theme-input'
            className='input-select'
            options={colorThemeOptions}
            component={FieldFormGroupSelect}>
            <FormattedMessage id="portal.brand.edit.chooseColorTheme.text"/>
          </Field>

        {/* <div className="form-group">
          <label className='control-label'><FormattedMessage id="portal.brand.edit.chooseColorTheme.text"/></label>
          <SelectWrapper
            {... colorTheme}
            className="input-select"
          />
        </div> */}

        <hr/>

        <FormGroup validationState={getReduxFormValidationState(availability)}>
          <ControlLabel><FormattedMessage id="portal.brand.edit.availability.text"/></ControlLabel>

          <Field
            name="availability"
            type="radio"
            value='private'
            component={Radio}>
            <FormattedMessage id="portal.brand.edit.availability.private.label" />
          </Field>

          {/* <Radio
            {...availability}
            value='private'
            ><FormattedMessage id="portal.brand.edit.availability.private.label" /></Radio> */}

          <Field
            name="availability"
            type="radio"
            value='public'
            component={Radio}>
            <FormattedMessage id="portal.brand.edit.availability.private.label" />
          </Field>

          {/* <Radio
            {...availability}
            value='public'
            ><FormattedMessage id="portal.brand.edit.availability.public.label" /></Radio> */}

          {availability.touched && availability.error &&
            <HelpBlock className='error-msg errorAvailability'>{availability.error}</HelpBlock>}
        </FormGroup>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button disabled={Object.keys(errors).length > 0} bsStyle="primary" type="submit" >{actionButtonTitle}</Button>
        </ButtonToolbar>
      </form>
  </SidePanel>

  )
}

BrandEditForm.displayName = 'BrandEditForm'

BrandEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fields: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func
}

function mapDispatchToProps() {
  return {
    onSubmit: formData => {
      console.log(formData);
    }
  }
}

function mapStateToProps() {
  return {  }
}

export default connect()(
  reduxForm({
    form: 'brand-edit',
    validate
  })(injectIntl(BrandEditForm))
)
