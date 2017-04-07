import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { Map, is } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes } from 'redux-form'

import { Button, ButtonToolbar } from 'react-bootstrap'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupCheckbox from '../shared/form-fields/field-form-group-checkbox'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'

import metadataActions from '../../redux/modules/entities/metadata/actions'
import { getById as getMetadata } from '../../redux/modules/entities/metadata/selectors'

import propertiesActions from '../../redux/modules/entities/properties/actions'
import { getById as getPropertyById } from '../../redux/modules/entities/properties/selectors'

import { buildReduxId } from '../../redux/util'

const getServiceType = (property) => {
  return property && property.getIn(['services', 0, 'service_type'])
}

/* Field Names */
const FIELD_REQUEST = 'custom_request_policy_xml'
const FIELD_RESPONSE = 'custom_response_policy_xml'
const FIELD_FINAL_REQUEST = 'custom_final_request_policy_xml'
const FIELD_FINAL_RESPONSE = 'custom_final_response_policy_xml'

const FIELD_USE_REQUEST = 'use_custom_request_policy_xml'
const FIELD_USE_RESPONSE = 'use_custom_response_policy_xml'
const FIELD_USE_FINAL_REQUEST = 'use_custom_final_request_policy_xml'
const FIELD_USE_FINAL_RESPONSE = 'use_custom_final_response_policy_xml'

class ConfigurationAdvanced extends React.Component {
  constructor(props) {
    super(props)

    this.restoreConfig = this.restoreConfig.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentWillMount() {
    const {brand, account, group, property} = this.props.params

    if (this.props.property) {
      this.fetchMetadata(this.props)
    } else {
      this.props.fetchProperty({brand, account, group, id: property})
    }
  }

  componentWillReceiveProps(nextProps) {
    //If property Changed, fetch metadata
    if (!is(this.props.property, nextProps.property)) {
      this.fetchMetadata(nextProps)
    }

    if (!is(this.props.customPolicyConfig, nextProps.customPolicyConfig)) {
      this.setInitialValues(nextProps)
    }
  }

  fetchMetadata(props) {
    const {brand, account, group, property} = props.params
    const serviceType = getServiceType(props.property)

    props.fetchMetadata({brand, account, group, property, serviceType})
  }

  setInitialValues(props) {
    console.log('setInitialValues', props);

    const {customPolicyConfig} = props

    const requestXML = customPolicyConfig.get(FIELD_REQUEST) !== ''
      ? customPolicyConfig.get(FIELD_REQUEST)
      : customPolicyConfig.get('request_policy_xml')

    const responseXML = customPolicyConfig.get(FIELD_RESPONSE) !== ''
      ? customPolicyConfig.get(FIELD_RESPONSE)
      : customPolicyConfig.get('response_policy_xml')


    const finalRequestXML = customPolicyConfig.get(FIELD_FINAL_REQUEST) !== ''
      ? customPolicyConfig.get(FIELD_FINAL_REQUEST)
      : customPolicyConfig.get('final_request_policy_xml')

    const finalResponseXML = customPolicyConfig.get(FIELD_FINAL_RESPONSE) !== ''
      ? customPolicyConfig.get(FIELD_FINAL_RESPONSE)
      : customPolicyConfig.get('final_response_policy_xml')



    this.props.initialize({
      [FIELD_USE_REQUEST]: customPolicyConfig.get(FIELD_USE_REQUEST),
      [FIELD_USE_RESPONSE]: customPolicyConfig.get(FIELD_USE_RESPONSE),
      [FIELD_USE_FINAL_REQUEST]: customPolicyConfig.get(FIELD_USE_FINAL_REQUEST),
      [FIELD_USE_FINAL_RESPONSE]: customPolicyConfig.get(FIELD_USE_FINAL_RESPONSE),

      [FIELD_REQUEST]: requestXML,
      [FIELD_RESPONSE]: responseXML,
      [FIELD_FINAL_REQUEST]: finalRequestXML,
      [FIELD_FINAL_RESPONSE]: finalResponseXML
    })
  }

  onSubmit(values) {
    /*
      TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
    */
    console.log('onSubmit-- values', values)
    const {brand, account, group, property} = this.props.params

    this.props.createMetadata({brand, account, group, property, serviceType: getServiceType(this.props.property), payload: values})
  }

  restoreConfig(configName) {
    /*
      TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
    */
    switch (configName) {
    //   case REQUEST:
    //
    //     break;
    //
    //   case RESPONSE:
    //
    //     break;
    //
    //   case FINAL_REQUEST:
    //
    //     break;
    //
    //   case FINAL_RESPONSE:
    //
    //     break;
    //
    //   default:
    //     break;
    }
  }

  render() {
    const {
      config,
      invalid,
      submitting,
      intl,
      isRequestEnabled,
      isResponseEnabled,
      isFinalRequestEnabled,
      isFinalResponseEnabled,
      handleSubmit
    } = this.props

    if (!config || !config.size) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <form className="configuration-advanced" onSubmit={handleSubmit(this.onSubmit)}>

        {/* Override Request Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.requestPolicies.label"/>}
          addonBefore={
            <Field
              name={FIELD_USE_REQUEST}
              component={FieldFormGroupCheckbox}
              checked={this.props.request_checkbox ? 'checked' : ''}
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
                    name={FIELD_REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isRequestEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_REQUEST)}
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
              name={FIELD_USE_RESPONSE}
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
                    name={FIELD_RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isResponseEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_RESPONSE)}
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
              name={FIELD_USE_FINAL_REQUEST}
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
                    name={FIELD_FINAL_REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalRequestEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_FINAL_REQUEST)}
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
              name={FIELD_USE_FINAL_RESPONSE}
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
                    name={FIELD_FINAL_RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalResponseEnabled}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_FINAL_RESPONSE)}
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
  config: Map(),
  metadata: Map(),
  property: Map(),
  customPolicyConfig: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {

  const selector = formValueSelector('advancedForm')

  const requestCheckbox = selector(state, FIELD_USE_REQUEST)
  const responseCheckbox = selector(state, FIELD_USE_RESPONSE)
  const finalRequestCheckbox = selector(state, FIELD_USE_FINAL_REQUEST)
  const finalResponseCheckbox = selector(state, FIELD_USE_FINAL_RESPONSE)


  /*
    TODO: UDNP-3136 - Integrate Manual Metadata Submission Redux with form
  */

  const property = getPropertyById(state, ownProps.params.property)
  const metadata = property && getMetadata(state, buildReduxId(property.get('published_host_id'), getServiceType(property)))

  const customPolicyConfig = metadata && metadata.get('customPolicyConfig')

  const initialValues = customPolicyConfig && customPolicyConfig.toJS()

  return {
    property,
    metadata,
    customPolicyConfig,
    isRequestEnabled: requestCheckbox,
    isResponseEnabled: responseCheckbox,
    isFinalRequestEnabled: finalRequestCheckbox,
    isFinalResponseEnabled: finalResponseCheckbox,

    initialValues: {
      ...initialValues
      // [FIELD_USE_REQUEST]: true, //customPolicyConfig && custom PolicyConfig.get('use_custom_request_policy_xml'),
      // [FIELD_USE_RESPONSE]: true, //customPolicyConfig && customPolicyConfig.get('use_custom_response_policy_xml'),
      // [FIELD_USE_FINAL_REQUEST]: true, //customPolicyConfig && customPolicyConfig.get('use_custom_final_request_policy_xml'),
      // [FIELD_USE_FINAL_RESPONSE]: true, //customPolicyConfig && customPolicyConfig.get('use_custom_final_response_policy_xml'),
      //
      // [FIELD_REQUEST]: customPolicyConfig && customPolicyConfig.get(FIELD_REQUEST),
      // [FIELD_RESPONSE]: customPolicyConfig && customPolicyConfig.get(FIELD_RESPONSE),
      // [FIELD_FINAL_REQUEST]: customPolicyConfig && customPolicyConfig.get(FIELD_FINAL_REQUEST),
      // [FIELD_FINAL_RESPONSE]: customPolicyConfig && customPolicyConfig.get(FIELD_FINAL_RESPONSE)
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperty: (params) => dispatch(propertiesActions.fetchOne(params)) ,

    fetchMetadata: (params) => dispatch(metadataActions.fetchAll(params)),
    createMetadata: (params) => dispatch(metadataActions.create(params)),
    updateMetadata: (params) => dispatch(metadataActions.update(params)),
    removeMetadata: (params) => dispatch(metadataActions.remove(params))
  }
}

const form = reduxForm({
  form: 'advancedForm'
})(injectIntl(ConfigurationAdvanced))

export default connect(mapStateToProps, mapDispatchToProps)(form)
