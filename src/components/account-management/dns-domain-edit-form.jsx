import React from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Input from './dns-form-input'

import './dns-domain-edit-form.scss'

const DnsDomainEditForm = (props) => {

  const {
    edit,
    fetching,
    intl,
    fields: {
      name,
      email_addr,
      name_server,
      refresh,
      ttl,
      negative_ttl
    },
    onDelete
  } = props

  const actionButtonTitle = fetching ? <FormattedMessage id="portal.button.saving"/> : edit ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>

  return (
    <form autoComplete="off">
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
        {props.edit &&
        <Button disabled={fetching} bsStyle="danger" className="pull-left"
          onClick={() => onDelete(props.fields.name.value)}>
          <FormattedMessage id="portal.button.delete"/>
        </Button>
          }
        <Button className="btn-outline" onClick={props.onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button disabled={Object.keys(props.errors).length > 0 || fetching} bsStyle="primary"
        onClick={() => props.onSave(props.fields)}>{actionButtonTitle}</Button>
      </ButtonToolbar>
    </form>
  )
}

DnsDomainEditForm.displayName = 'DnsDomainEditForm'

DnsDomainEditForm.propTypes = {
  edit: React.PropTypes.bool,
  errors: React.PropTypes.object,
  fetching: React.PropTypes.bool,
  fields: React.PropTypes.object.isRequired,
  intl: React.PropTypes.shape(intlShape),
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func
}

export default injectIntl(DnsDomainEditForm)
