import React from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import SelectWrapper from '../select-wrapper.jsx'
import UDNFileInput from '../udn-file-input.jsx'

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

    <Modal show={true} dialogClassName="brand-edit-form-sidebar">

      <Modal.Header>
        <h1>{title}</h1>
        <p>Lorem ipsum</p>
      </Modal.Header>

      <Modal.Body>
        <form>

          <Input
            {...brandName}
            type="text"
            label={this.props.intl.formatMessage({id: 'portal.brand.edit.brandName.text'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.brand.edit.brandName.placeholder'})}
          />

          {brandName.touched && brandName.error && <div className='error-msg errorBrandName'>{brandName.error}</div>}

          <hr/>

          <UDNFileInput
            {...brandLogo}
            id='brand-input'
            label={this.props.intl.formatMessage({id: 'portal.brand.edit.logo.text'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.brand.edit.logo.placeholder'})}
            addonAfter=' ICO, GIF or PNG'
            className='input-file'
          />

          <hr/>

          <UDNFileInput
            {...favicon}
            id='favicon-input'
            label={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.text'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.placeholder'})}
            addonAfter={this.props.intl.formatMessage({id: 'portal.brand.edit.favicon.addonAfter'})}
            className='input-file'
          />

          <hr/>

          <div className="form-group">
            <label className='control-label'><FormattedMessage id="portal.brand.edit.chooseColorTheme.text"/></label>
            <SelectWrapper
              {... colorTheme}
              className="input-select"
              options={colorThemeOptions}
            />
          </div>

          <hr/>

          <div className="form-group">
            <label className='control-label'><FormattedMessage id="portal.brand.edit.availability.text"/></label>
            <Input {...availability} value='private' type="radio" label={this.props.intl.formatMessage({id: 'portal.brand.edit.availability.label'})}/>
          </div>

          <div className="form-group">
            <Input {...availability} value='public' type="radio" label='Public' />
          </div>

          {availability.touched && availability.error && <div className='error-msg errorAvailability'>{availability.error}</div>}

          <ButtonToolbar className="text-right extra-margin-top">
            <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
            <Button disabled={Object.keys(errors).length > 0} bsStyle="primary" onClick={props.onSave} >{actionButtonTitle}</Button>
          </ButtonToolbar>
        </form>

      </Modal.Body>
    </Modal>
  )
}

BrandEditForm.displayName = 'BrandEditForm'

BrandEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fields: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func
}

export default reduxForm({
  form: 'brand-edit',
  fields: ['brandName', 'brandLogo', 'favicon', 'colorTheme', 'availability'],
  validate
})(injectIntl(BrandEditForm))
