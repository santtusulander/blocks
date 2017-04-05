import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal, Table, Nav, NavItem, FormControl } from 'react-bootstrap'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import HasServicePermission from '../../has-service-permission'

import SidePanel from '../../side-panel'
import TokenSchema from './token-auth-forms/token-schema'
import TokenStreaming from './token-auth-forms/token-streaming'
import IconChevronRight from '../../shared/icons/icon-chevron-right'
import FieldFormGroup from '../../shared/forms/field-form-group'
import FieldFormGroupSelect from '../../shared/forms/field-form-group-select'
import FormFooterButtons from '../../shared/forms/form-footer-buttons'
import TruncatedTitle from '../../truncated-title'
import ButtonDisableTooltip from '../../button-disable-tooltip'

import { ENCRYPTION_OPTIONS,
         SAMPLE_CODE_LANGUAGE_OPTIONS,
         SCHEMA_OPTIONS,
         SAMPLE_CODE_LANGUAGE_DEFAULT,
         SCHEMA_DEFAULT,
         ENCRYPTION_DEFAULT,
         TA_TYPE_DEFAULT } from '../../../constants/configuration'

import { VOD_STREAMING_TOKEN_AUTH } from '../../../constants/service-permissions'

import * as uiActionCreators from '../../../redux/modules/ui'

import { generateStaticTokenTableData,
         generateTokenData,
         generateTokenHash,
         generateFinalURL,
         getQueryArguments } from '../../../util/token-authentication'

const validate = ({ shared_key }) => {
  const errors = {}

  if (!shared_key) {
    errors.shared_key = <FormattedMessage id="portal.policy.edit.tokenauth.shared_key.required.error" />
  }

  return errors
}

export class TokenAuth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      detailForm: null,
      activeSampleCodeTab: SAMPLE_CODE_LANGUAGE_DEFAULT
    }

    this.saveChanges = this.saveChanges.bind(this)
    this.closeDetailForm = this.closeDetailForm.bind(this)
    this.showSampleCodeDialog = this.showSampleCodeDialog.bind(this)

    this.notificationTimeout = null
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('shared_key', set.get('shared_key'))
    this.props.change('schema', set.get('schema', Immutable.List(SCHEMA_DEFAULT)))
    this.props.change('encryption', set.get('encryption', ENCRYPTION_DEFAULT))
    this.props.change('type', set.get('type', TA_TYPE_DEFAULT))
    this.props.change('streaming_ttl', set.get('streaming_ttl'))
    this.props.change('streaming_add_ip_addr', set.get('streaming_add_ip_addr'))
    this.props.change('streaming_encryption', set.get('streaming_encryption'))
  }

  saveChanges(values) {
    const { invalid, path} = this.props
    const { type, shared_key, encryption, streaming_ttl, streaming_add_ip_addr, schema, streaming_encryption } = values

    if (!invalid) {
      const newSet = Immutable.fromJS({
        type,
        shared_key,
        schema,
        streaming_ttl,
        streaming_add_ip_addr,
        encryption,
        streaming_encryption
      })

      this.props.saveAction(path, this.props.setKey, newSet)
    }
  }

  closeDetailForm() {
    this.setState({detailForm: null})
  }

  renderAdvancedOptions() {
    return (
      <div>
        <div className="flex-row options-item">
          <div className="flex-item options-item--name">{<FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />}</div>
          <div className="flex-item arrow-right">
            <a
              className="btn btn-icon btn-transparent"
              onClick={(e) => {
                e.stopPropagation()
                this.setState({detailForm: 'schema'})
              }}
            >
              <IconChevronRight />
            </a>
          </div>
        </div>
        <HasServicePermission allOf={[VOD_STREAMING_TOKEN_AUTH]}>
          <div className="flex-row options-item">
            <div className="flex-item options-item--name">{<FormattedMessage id="portal.policy.edit.tokenauth.streaming_options.text" />}</div>
            <div className="flex-item arrow-right">
              <a
                className="btn btn-icon btn-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  this.setState({detailForm: 'streaming'})
                }}
              >
                <IconChevronRight />
              </a>
            </div>
          </div>
        </HasServicePermission>
      </div>
    )
  }

  showSampleOutputDialog() {
    this.props.uiActions.showInfoDialog({
      className: 'token-auth-sample-dialog',
      title: <FormattedMessage id='portal.policy.edit.tokenauth.sampleOutputDialog.title'/>,
      children: this.renderSampleOutputDialogChildren(this.props.tokenValues),
      okButton: true,
      cancelButton: true,
      cancel: () => this.props.uiActions.hideInfoDialog()
      // UDNP-3305 this part should be uncommented whenever we have the sample codes
      // auxiliaryButton: {
      //   handler: () => this.showSampleCodeDialog(),
      //   text: <FormattedMessage id="portal.policy.edit.tokenauth.sampleOutputDialog.sampleCodeButton.text" />
      // }
    })
  }

  showSampleCodeDialog() {
    const { encryption } = this.props.tokenValues

    const hashMethod = ENCRYPTION_OPTIONS.filter(({value}) => encryption === value)[0].label
    this.props.uiActions.showInfoDialog({
      className: 'token-auth-sample-dialog',
      title: <FormattedMessage id='portal.policy.edit.tokenauth.sampleCodeDialog.title' values={{ hashMethod }} />,
      children: this.renderSampleCodeDialogChildren(),
      okButton: true,
      cancel: () => this.props.uiActions.hideInfoDialog(),
      secondaryButton: {
        handler: () => this.copySampleCodeToClipboard(),
        text: <FormattedMessage id="portal.policy.edit.tokenauth.sampleCodeDialog.copyCodeButton.text" />
      }
    })
  }

  copySampleCodeToClipboard() {
    document.querySelector('.token-auth-sample-code-textarea').select()

    // UDNP-3154 I've used try/catch here because the 'copy' command can throw an error in certain scenarios.
    // https://w3c.github.io/editing/execCommand.html#the-copy-command
    try {
      const result = document.execCommand('copy')
      result
        ?
        this.showNotification(<FormattedMessage id="portal.policy.edit.tokenauth.sampleCodeDialog.copyCode.successful.message" />)
        :
        this.showNotification(<FormattedMessage id="portal.policy.edit.tokenauth.sampleCodeDialog.copyCode.unsuccessful.message" />)
    } catch (e) {
      this.showNotification(<FormattedMessage id="portal.policy.edit.tokenauth.sampleCodeDialog.copyCode.unsuccessful.message" />)
    }
  }

  showNotification(message) {
    // UDNP-3305 toast notification element won't be visible because it's under the Token Authentication modal!
    // So if we want to show a message about copy operation status we should find another way
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeSidePanelNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeSidePanelNotification, 10000)
  }

  renderSampleOutputDialogChildren({ schema, encryption, sharedKey }) {
    const renderRow = (titleID, content, index) => {
      return (
        <tr key={index} className="sample-token-output-table-row">
          <td><FormattedMessage id={titleID} /></td>
          <td><TruncatedTitle content={String(content)} /></td>
        </tr>
      )
    }

    const schemaOptions = schema.map(item => (
      SCHEMA_OPTIONS.filter(({value}) => value === item)[0]
    ))
    const schemaRows = generateStaticTokenTableData(schema)
    const tokenData = generateTokenData(schema)
    const tokenHash = generateTokenHash(encryption, sharedKey, tokenData)
    const finalURL = generateFinalURL(tokenHash, getQueryArguments(schema))

    const tableRows = [
      {
        labelID: 'portal.policy.edit.tokenauth.sampleOutputDialog.table.schema.title',
        value: schemaOptions.map(({ label }) => this.props.intl.formatMessage({ id: label })).join(' + ')
      },
      ...schemaRows,
      {
        labelID: 'portal.policy.edit.tokenauth.sampleOutputDialog.table.token_data.title',
        value: tokenData
      },
      {
        labelID: 'portal.policy.edit.tokenauth.sampleOutputDialog.table.token_hash.title',
        value: tokenHash
      },
      {
        labelID: 'portal.policy.edit.tokenauth.sampleOutputDialog.table.final_url.title',
        value: finalURL
      }
    ]

    return (
      <Table striped={true} className="fixed-layout">
        <thead>
          <tr>
            <th><FormattedMessage id="portal.policy.edit.tokenauth.sampleOutputDialog.table.header.item.text" /></th>
            <th><FormattedMessage id="portal.policy.edit.tokenauth.sampleOutputDialog.table.header.value.text" /></th>
          </tr>
        </thead>
        <tbody>
          { tableRows.map((row, index) => renderRow(row.labelID, row.value, index)) }
        </tbody>
      </Table>
    )
  }

  renderSampleCodeDialogChildren() {
    return (
      <div>
        <Nav
          style={{background: 'none'}}
          bsStyle='tabs'
          activeKey={this.state.activeSampleCodeTab}
          onSelect={key => {
            this.setState({ activeSampleCodeTab: key })
            setTimeout(this.showSampleCodeDialog, 0)
          }}
        >
        {
          SAMPLE_CODE_LANGUAGE_OPTIONS.map(option => (
            <NavItem key={option.value} eventKey={option.value}>
              <FormattedMessage id={option.label} />
            </NavItem>
          ))
        }
        </Nav>
        <FormControl
          componentClass="textarea"
          readOnly={true}
          className='token-auth-sample-code-textarea'
          value={this.state.activeSampleCodeTab}
        />
      </div>
    )
  }

  render() {
    const {
      close,
      invalid,
      submitting,
      schema,
      tokenValues: {
        encryption,
        sharedKey
      },
      type,
      streaming_ttl,
      streaming_add_ip_addr,
      streaming_encryption,
      handleSubmit
    } = this.props

    let sidePanelTitle = ''

    if (this.state.detailForm === 'schema') {
      sidePanelTitle = <FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />
    }
    if (this.state.detailForm === 'streaming') {
      sidePanelTitle = <FormattedMessage id="portal.policy.edit.tokenauth.streaming.text" />
    }

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.tokenauth.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.tokenauth.subheader"/></p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Field
              name="encryption"
              className="input-select"
              component={FieldFormGroupSelect}
              options={ENCRYPTION_OPTIONS}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.hash_function.text" />}
            />

            <Field
              type="text"
              name="shared_key"
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
              required={true}
            />

            <hr/>

            <h5>
              <FormattedMessage id="portal.policy.edit.tokenauth.advanced_options.text" />
            </h5>

            <br/>

            {this.renderAdvancedOptions()}

            <FormFooterButtons className="token-auth-no-side-padding">
              <ButtonDisableTooltip
                bsStyle="link"
                className="pull-left token-auth-no-side-padding"
                disabled={!(encryption === 'MD5') && !sharedKey}
                onClick={() => this.showSampleOutputDialog()}
                tooltipId="tooltip-help"
                tooltipMessage={{text: this.props.intl.formatMessage({ id: "portal.policy.edit.tokenauth.viewSampleButton.disabledTooltip.text" })}}>
                <FormattedMessage id="portal.policy.edit.tokenauth.viewSampleButton.text" />
              </ButtonDisableTooltip>

              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid || submitting}
              >
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
          </form>
        </Modal.Body>

        <SidePanel
          show={!!this.state.detailForm}
          className='narrow'
          title={sidePanelTitle}
          cancel={this.closeDetailForm}
          overlapping={true}
        >
          {this.state.detailForm === 'schema' &&
            <TokenSchema
              schema={schema}
              close={this.closeDetailForm}
            />
          }
          {this.state.detailForm === 'streaming' &&
            <TokenStreaming
              type={type}
              streaming_ttl={streaming_ttl}
              streaming_add_ip_addr={streaming_add_ip_addr}
              streaming_encryption={streaming_encryption}
              close={this.closeDetailForm}
            />
          }
        </SidePanel>
      </div>
    )
  }
}

TokenAuth.displayName = 'TokenAuth'
TokenAuth.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  invalid: React.PropTypes.bool,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map),
  setKey: React.PropTypes.string,
  shared_key: React.PropTypes.string,
  ...reduxFormPropTypes
}

const authFormSelector = formValueSelector('token-auth-form')

const mapStateToProps = (state) => (
  {
    tokenValues: {
      encryption: authFormSelector(state, 'encryption'),
      schema: authFormSelector(state, 'schema'),
      sharedKey: authFormSelector(state, 'shared_key')
    }
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
)

const form = reduxForm({
  form: 'token-auth-form',
  validate
})(TokenAuth)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
