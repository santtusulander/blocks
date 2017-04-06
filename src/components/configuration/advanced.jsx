import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ButtonToolbar } from 'react-bootstrap'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupCheckbox from '../shared/form-fields/field-form-group-checkbox'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'

const REQUEST = 'request'
const RESPONSE = 'response'
const FINAL_REQUEST = 'final_request'
const FINAL_RESPONSE = 'final_response'

class ConfigurationAdvanced extends React.Component {
  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
    this.restoreConfig = this.restoreConfig.bind(this)
  }

  handleSave(e) {
    /*
      TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
    */
    e.preventDefault()
  }

  restoreConfig(configName) {
    /*
      TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
    */
    switch (configName) {
      case REQUEST:

        break;

      case RESPONSE:

        break;

      case FINAL_REQUEST:

        break;

      case FINAL_RESPONSE:

        break;

      default:
        break;
    }
  }

  render() {
    const { config, invalid, submitting, intl,
            isRequestEnabled, isResponseEnabled,
            isFinalRequestEnabled, isFinalResponseEnabled } = this.props

    if (!config || !config.size) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <form className="configuration-advanced" onSubmit={this.handleSave}>

        {/* Override Request Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.requestPolicies.label"/>}
          addonBefore={
            <Field
              name="request_checkbox"
              component={FieldFormGroupCheckbox}
            />
          }
        />
        <hr />

        {isRequestEnabled &&
          <SectionContainer className="request-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isRequestEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(REQUEST)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isRequestEnabled)}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }


        {/* Override Response Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.responsePolicies.label"/>}
          addonBefore={
            <Field
              name="response_checkbox"
              component={FieldFormGroupCheckbox}
            />
          }
        />
        <hr />

        {isResponseEnabled &&
          <SectionContainer className="response-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isResponseEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(RESPONSE)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isResponseEnabled)}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }

        {/* Override Final Request Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.finalRequestPolicies.label"/>}
          addonBefore={
            <Field
              name="final_request_checkbox"
              component={FieldFormGroupCheckbox}
            />
          }
        />
        <hr />

        {isFinalRequestEnabled &&
          <SectionContainer className="final-request-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FINAL_REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalRequestEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FINAL_REQUEST)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isFinalRequestEnabled)}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }

        {/* Override Final Response Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.finalResponsePolicies.label"/>}
          addonBefore={
            <Field
              name="final_response_checkbox"
              component={FieldFormGroupCheckbox}
            />
          }
        />
        <hr />

        {isFinalResponseEnabled &&
          <SectionContainer className="final-response-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FINAL_RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalResponseEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FINAL_RESPONSE)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isFinalResponseEnabled)}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }

        <ButtonToolbar className="text-left">
          <Button
            type="submit"
            bsStyle="primary"
            disabled={!(isFinalRequestEnabled || isFinalResponseEnabled || isRequestEnabled || isResponseEnabled)}
          >
            <FormattedMessage id="portal.button.save"/>
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

ConfigurationAdvanced.displayName = 'ConfigurationAdvanced'
ConfigurationAdvanced.propTypes = {
  config: PropTypes.instanceOf(Map),
  intl: intlShape.isRequired,
  isFinalRequestEnabled: PropTypes.bool,
  isFinalResponseEnabled: PropTypes.bool,
  isRequestEnabled: PropTypes.bool,
  isResponseEnabled: PropTypes.bool,
  ...reduxFormPropTypes
}

ConfigurationAdvanced.defaultProps = {
  config: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state) => {
  const selector = formValueSelector('advancedForm')

  const requestCheckbox = selector(state, 'request_checkbox')
  const responseCheckbox = selector(state, 'response_checkbox')
  const finalRequestCheckbox = selector(state, 'final_request_checkbox')
  const finalResponseCheckbox = selector(state, 'final_response_checkbox')


  /*
    TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
  */
  return {
    isRequestEnabled: requestCheckbox,
    isResponseEnabled: responseCheckbox,
    isFinalRequestEnabled: finalRequestCheckbox,
    isFinalResponseEnabled: finalResponseCheckbox,
    initialValues: {
      request: '<html><html>',
      response: '<html><html>',
      final_request: '<html><html>',
      final_response: '<html><html>'
    }
  }
}

const form = reduxForm({
  form: 'advancedForm'
})(injectIntl(ConfigurationAdvanced))

export default connect(mapStateToProps)(form)
