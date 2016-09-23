import React from 'react'
import { Input, ButtonToolbar, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import './dns-domain-edit-form.scss'

const DnsDomainEditForm = (props) => {

  const {
    edit,
    fetching,
    fields: {
      name,
      email_addr,
      name_server,
      refresh,
      ttl,
      negative_ttl
      }
    } = props

  const actionButtonTitle = fetching ? <FormattedMessage id="portal.button.saving"/> : edit ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>

  return (
    <form autoComplete="off">
      <Input
        {...name}
      type="text"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.domainName.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.domainNamePlaceholder.text'})}
      disabled={props.edit}
      />

      {name.touched && name.error && <div className='error-msg'>{name.error}</div>}

      <hr/>

      <Input
        {...name_server}
      type="text"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.nameServer.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.nameServerPlaceholder.text'})}
      />

      {name_server.touched && name_server.error && <div className='error-msg'>{name_server.error}</div>}

      <hr/>

      <Input
        {...email_addr}
      type="text"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.email.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.emailPlaceholder.text'})}
      />

      {email_addr.touched && email_addr.error && <div className='error-msg'>{email_addr.error}</div>}

      <hr/>

      <Input
        {...refresh}
      type="number"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.refresh.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.refreshPlaceholder.text'})}
      addonAfter={<FormattedMessage id="portal.units.seconds"/>}
      />

      {refresh.touched && refresh.error && <div className='error-msg'>{refresh.error}</div>}

      <hr/>

      <Input
        {...ttl}
      type="number"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.ttl.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.ttlPlaceholder.text'})}
      addonAfter={<FormattedMessage id="portal.units.seconds"/>}
      />

      {ttl.touched && ttl.error && <div className='error-msg'>{ttl.error}</div>}

      <hr/>

      <Input
        {...negative_ttl}
      type="number"
      label={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.negativeTtl.text'}) + ' *'}
      placeholder={props.intl.formatMessage({id: 'portal.accountManagement.dns.form.negativeTtlPlaceholder.text'})}
      addonAfter={<FormattedMessage id="portal.units.seconds"/>}
      />

      {negative_ttl.touched && negative_ttl.error && <div className='error-msg'>{negative_ttl.error}</div>}

      <ButtonToolbar className="text-right extra-margin-top">
        {props.edit &&
        <Button disabled={fetching} bsStyle="danger" className="pull-left"
          onClick={() => props.onDelete(props.fields.name.value)}>
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
  fetching: React.PropTypes.bool,
  fields: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  values: React.PropTypes.object
}

export default injectIntl(DnsDomainEditForm)
