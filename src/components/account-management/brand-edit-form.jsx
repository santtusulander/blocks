import React, { Component } from 'react'
import { Modal, Input, ButtonToolbar, Button, Label } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import SelectWrapper from '../select-wrapper.jsx'
import UDNFileInput from '../udn-file-input.jsx'

import './brand-edit-form.scss'

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

  const {brandName, brandLogo, favicon, colorTheme, availability} = values

  if (!brandName || brandName.length === 0) errors.brandName = 'brandName is required'

  return errors;
}

const BrandEditForm = (props) => {

  const title = props.edit ? 'Edit Brand' : 'New Brand'
  const actionButtonTitle = props.edit ? 'Save' : 'Add'

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
            { ...brandName }
            type="text"
            label="Brand Name"
            placeholder="Enter Brand Name"
          />

          {brandName.touched && brandName.error && <div className='error-msg errorBrandName'>{brandName.error}</div>}

          <hr/>

          <UDNFileInput
            { ...brandLogo }
            id='brand-input'
            label="Brand Logo"
            placeholder="Enter Brand Name"
            addonAfter=' ICO, GIF or PNG'
            className='input-file'
          />

          <hr/>

          <UDNFileInput
            { ...favicon }
            id='favicon-input'
            label="Favicon"
            placeholder="Enter Favicon"
            addonAfter=' Best in SVG format (logo may be scaled)'
            className='input-file'
          />

          <hr/>

          <div className="form-group">
            <label className='control-label'>Choose Color Theme</label>
            <SelectWrapper
              { ... colorTheme }
              className="input-select"
              options={ colorThemeOptions }
            />
          </div>

          <hr/>

          <div className="form-group">
            <label className='control-label'>Availability</label>
            <Input {...availability} value='private' type="radio" label='Keep private (only I can assign this brand to accounts)'/>
          </div>

          <div className="form-group">
            <Input {...availability} value='public' type="radio" label='Public' />
          </div>

          {availability.touched && availability.error && <div className='error-msg errorAvailability'>{availability.error}</div>}

          <ButtonToolbar className="text-right extra-margin-top">
            <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
            <Button disabled={ Object.keys(errors).length > 0 } bsStyle="primary" onClick={props.onSave} >{ actionButtonTitle }</Button>
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
})(BrandEditForm)
