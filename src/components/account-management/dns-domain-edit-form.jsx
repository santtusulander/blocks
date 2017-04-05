import React from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { checkForErrors } from '../../util/helpers'
import {
  isValidFQDN,
  isInt,
  isValidIPv4Address,
  isValidNameserver,
  isValidSOARecord
} from '../../util/validators'
import FieldFormGroup from '../shared/form-fields/field-form-group'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'
import FieldFormGroupNumber from '../shared/form-fields/field-form-group-number.jsx'
import { DNS_MIN_TTL, DNS_MAX_TTL, DNS_MIN_REFRESH } from '../../constants/account-management-options'

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
  const maxTtl = '' + DNS_MAX_TTL
  const minTtl = '' + DNS_MIN_TTL
  const minRefresh = '' + DNS_MIN_REFRESH

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
    refresh: [
      {
        condition: !isInt(refresh),
        errorText: <FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>
      },
      {
        condition: !(parseInt(refresh) >= 0),
        errorText: <FormattedMessage id="portal.accountManagement.dns.form.validation.minRefresh.text" values={{minRefresh}}/>
      }
    ],
    ttl: [
      {
        condition: !isInt(ttl),
        errorText: <FormattedMessage id="portal.accountManagement.dns.form.validation.ttl.text"/>
      },
      {
        condition: parseInt(ttl) > maxTtl,
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
      },
      {
        condition: !(parseInt(ttl) >= 0),
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.minTtl.text' values={{minTtl}}/>
      }
    ],
    negative_ttl: [
      {
        condition: isNaN(negative_ttl),
        errorText: <FormattedMessage id="portal.account.domainForm.validation.negativeTtl.text"/>
      },
      {
        condition: parseInt(negative_ttl) > maxTtl,
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxNegativeTtl.text' values={{maxTtl}}/>
      },
      {
        condition: !(parseInt(negative_ttl) >= 0),
        errorText: <FormattedMessage id='portal.accountManagement.dns.form.validation.minNegativeTtl.text' values={{minTtl}}/>
      }
    ]
  }
  const requiredTexts = {
    name: <FormattedMessage id="portal.accountManagement.dns.form.validation.name.text"/>,
    email_addr: <FormattedMessage id="portal.accountManagement.dns.form.validation.email.text"/>,
    name_server: <FormattedMessage id="portal.accountManagement.dns.form.validation.nameServer.text"/>,
    refresh: <FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>,
    ttl: <FormattedMessage id="portal.accountManagement.dns.form.validation.ttl.text"/>,
    negative_ttl: <FormattedMessage id="portal.account.domainForm.validation.negativeTtl.text"/>
  }
  return checkForErrors({ ttl, negative_ttl, email_addr, name, name_server, refresh },
                        customConditions, requiredTexts)
}

const DnsDomainEditForm = (props) => {

  const {
    edit,
    fetching,
    intl,
    onCancel,
    invalid,
    submitting,
    onSave
  } = props

  const actionButtonTitle = fetching
    ? <FormattedMessage id="portal.button.saving"/>
    : edit
      ? <FormattedMessage id="portal.button.save"/>
      : <FormattedMessage id="portal.button.add"/>

  return (
    <form onSubmit={props.handleSubmit(onSave)}>

      <Field
        type="text"
        name="name"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.domainNamePlaceholder.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.accountManagement.dns.form.domainName.text" />}
        disabled={edit}
      />

      <hr/>

      <Field
        type="text"
        name="name_server"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.nameServerPlaceholder.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.accountManagement.dns.form.nameServer.text" />}
      />

      <hr/>

      <Field
        type="text"
        name="email_addr"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.emailPlaceholder.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.accountManagement.dns.form.email.text" />}
      />

      <hr/>

      <Field
        name="refresh"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.refresh.text'})}
        component={FieldFormGroupNumber}
        min={DNS_MIN_REFRESH}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        label={<FormattedMessage id="portal.accountManagement.dns.form.refresh.text" />}
      />

      <hr/>

      <Field
        name="ttl"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.ttlPlaceholder.text'})}
        component={FieldFormGroupNumber}
        min={DNS_MIN_TTL}
        max={DNS_MAX_TTL}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        label={<FormattedMessage id="portal.accountManagement.dns.form.ttl.text" />}
      />

      <hr/>

      <Field
        name="negative_ttl"
        placeholder={intl.formatMessage({id: 'portal.accountManagement.dns.form.negativeTtlPlaceholder.text'})}
        component={FieldFormGroupNumber}
        min={DNS_MIN_TTL}
        max={DNS_MAX_TTL}
        addonAfter={<FormattedMessage id="portal.units.seconds"/>}
        label={<FormattedMessage id="portal.accountManagement.dns.form.negativeTtl.text" />}
      />

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
          {actionButtonTitle}
        </Button>
      </FormFooterButtons>

    </form>
  )
}

DnsDomainEditForm.displayName = 'DnsDomainEditForm'

DnsDomainEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fetching: React.PropTypes.bool,
  intl: intlShape,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'dnsDomainEditForm',
  validate
})(injectIntl(DnsDomainEditForm))
