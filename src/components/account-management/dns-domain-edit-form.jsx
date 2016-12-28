import React from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'

import { Button } from 'react-bootstrap'
import FormFooterButtons from '../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import FieldFormGroup from '../form/field-form-group'

//import Input from './dns-form-input'

import './dns-domain-edit-form.scss'
import { checkForErrors } from '../../util/helpers'
import {
  isValidFQDN,
  isInt,
  isValidIPv4Address,
  isValidNameserver,
  isValidSOARecord
} from '../../util/validators'

const validate = fields => {
  // TODO: name_server validation
  // From API-docs:
  // Any name server that will respond authoritatively for the domain.
  // Called the Primary Master in the context of Dynamic DNS (DDNS).
  // If DDNS is not used this may be any suitable name server either
  // within the zone file (in-zone) or in an external or foreign zone
  // (also called out-of-zone or even out-of-bailiwick by those of a
  // more literary bent or with a taste for the exotic). To mimimise
  // confusion this is most commonly written as a Fully-qualified
  // Domain Name (FQDN - ends with a dot). If the record points to
  // an EXTERNAL server (not defined in this zone) it MUST be a FQDN
  // and end with a '.' (dot), for example, ns1.example.net.
  const { ttl, negative_ttl, email_addr, name, name_server, refresh } = fields
  const maxTtl = 2147483647;

  const customConditions = {
    name_server: {
      condition: !isValidIPv4Address(name_server) ? !isValidNameserver(name_server) : false,
      errorText: <FormattedMessage id='portal.account.domainForm.validation.nameServer'/>
    },
    name: {
      condition: !isValidFQDN(name),
      errorText: <FormattedMessage id='portal.account.domainForm.validation.domainName'/>
    },
    email_addr: {
      condition: !isValidSOARecord(email_addr),
      errorText: <FormattedMessage id='portal.account.domainForm.validation.mailbox'/>
    },
    refresh: {
      condition: !isInt(refresh),
      errorText:<FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>
    },
    ttl: [
      {
        condition: !isInt(ttl),
        errorText:<FormattedMessage id="portal.accountManagement.dns.form.validation.ttl.text"/>
      },
      {
        condition: parseInt(ttl) > maxTtl,
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
      }
    ],
    negative_ttl: [
      {
        condition: isNaN(negative_ttl),
        errorText:<FormattedMessage id="portal.account.domainForm.validation.negativeTtl.text"/>
      },
      {
        condition: parseInt(negative_ttl) > maxTtl,
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
      }
    ]
  }
  const requiredTexts = {
    name: <FormattedMessage id="portal.accountManagement.dns.form.validation.name.text"/>,
    email_addr: <FormattedMessage id="portal.accountManagement.dns.form.validation.email.text"/>,
    name_server: <FormattedMessage id="portal.accountManagement.dns.form.validation.nameServer.text"/>,
    refresh: <FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>
  }
  return checkForErrors(fields, customConditions, requiredTexts)
}

const DnsDomainEditForm = (props) => {

  const {
    edit,
    fetching,
    intl,
    onCancel,
    invalid,
    submitting
    /*fields: {
      name,
      email_addr,
      name_server,
      refresh,
      ttl,
      negative_ttl
    }*/
  } = props

  const actionButtonTitle = fetching ? <FormattedMessage id="portal.button.saving"/> : edit ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>

  return (
    <form autoComplete="off">

      <Field
        type="text"
        name="name"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.domainNamePlaceholder.text'})}
        component={FieldFormGroup}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.domainName.text" />
      </Field>

      <hr/>

      <Field
        type="text"
        name="name_server"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.nameServerPlaceholder.text'})}
        component={FieldFormGroup}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.nameServer.text" />
      </Field>

      <hr/>

      <Field
        type="text"
        name="email_addr"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.emailPlaceholder.text'})}
        component={FieldFormGroup}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.email.text" />
      </Field>

      <hr/>

      <Field
        type="number"
        name="refresh"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.refresh.text'})}
        component={FieldFormGroup}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.refresh.text" />
      </Field>

      <hr/>

      <Field
        type="number"
        name="ttl"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.ttlPlaceholder.text'})}
        component={FieldFormGroup}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.ttl.text" />
      </Field>

      <hr/>

      <Field
        type="number"
        name="negative_ttl"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.negativeTtlPlaceholder.text'})}
        component={FieldFormGroup}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        >
        <FormattedMessage id="portal.accountManagement.dns.form.negativeTtl.text" />
      </Field>

      <hr/>

      <FormFooterButtons>
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid||submitting}>
            <FormattedMessage id="portal.button.save"/>
          </Button>
        </FormFooterButtons>
{/*
      <Input
        {...name}
        labelID="portal.accountManagement.dns.form.domainName.text"
        disabled={edit}
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.domainNamePlaceholder.text'})}>
        {name.touched && name.error && <div className='error-msg'>{name.error}</div>}
      </Input>

      <hr/>

      <Input
        {...name_server}
        labelID='portal.accountManagement.dns.form.nameServer.text'
        placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.nameServerPlaceholder.text'})}>
        {name_server.touched && name_server.error && <div className='error-msg'>{name_server.error}</div>}
      </Input>

      <hr/>

      <Input
        {...email_addr}
        labelID='portal.accountManagement.dns.form.email.text'
        placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.emailPlaceholder.text'})}>
        {email_addr.touched && email_addr.error && <div className='error-msg'>{email_addr.error}</div>}
      </Input>

      <hr/>

      <Input
        {...refresh}
        type="number"
        labelID='portal.accountManagement.dns.form.refresh.text'
        placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.refreshPlaceholder.text'})}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}>
        {refresh.touched && refresh.error && <div className='error-msg'>{refresh.error}</div>}
      </Input>

      <hr/>

      <Input
        {...ttl}
        type="number"
        labelID='portal.accountManagement.dns.form.ttl.text'
        placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.ttlPlaceholder.text'})}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}>
        {ttl.touched && ttl.error && <div className='error-msg'>{ttl.error}</div>}
      </Input>

      <hr/>

      <Input
        {...negative_ttl}
        type="number"
        labelID='portal.accountManagement.dns.form.negativeTtl.text'
        placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.negativeTtlPlaceholder.text'})}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}>
        {negative_ttl.touched && negative_ttl.error && <div className='error-msg'>{negative_ttl.error}</div>}
      </Input>

      <ButtonToolbar className="text-right extra-margin-top">
        <Button className="btn-outline" onClick={props.onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button disabled={Object.keys(props.errors).length > 0 || fetching} bsStyle="primary"
        onClick={() => props.onSave(props.fields)}>{actionButtonTitle}</Button>
      </ButtonToolbar>
      */}
    </form>
  )
}

DnsDomainEditForm.displayName = 'DnsDomainEditForm'

DnsDomainEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.shape(intlShape),
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'dnsDomainEditForm',
  validate
})(injectIntl(DnsDomainEditForm))
