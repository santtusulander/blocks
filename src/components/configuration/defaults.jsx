import React from 'react'
import {Row, Col, Input, Button} from 'react-bootstrap'
import Immutable from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import ConfigurationPolicyRules from './policy-rules'
import ConfigurationPolicyRuleEdit from './policy-rule-edit'
import CacheKeyQueryStringForm from './actions/cache-key-query-string-form'
import ConfigurationSidebar from './sidebar'
import Toggle from '../toggle'
import Select from '../select'
import IconAdd from '../icons/icon-add.jsx'
import IsAllowed from '../is-allowed'

import { getActiveMatchSetForm, secondsToUnit, secondsFromUnit } from './helpers'
import { MODIFY_PROPERTY } from '../../constants/permissions'

const policyPath = Immutable.List(['default_policy', 'policy_rules'])
const getNameIndex = config => config.getIn(policyPath)
  .findIndex(policy => {
    if(policy.has('set')) {
      return policy.get('set').has('cache_name')
    }
  })

class ConfigurationDefaults extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ttlUnit: 'seconds'
    }

    this.addRule = this.addRule.bind(this)
    this.changeTTLUnit = this.changeTTLUnit.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEtagChange = this.handleEtagChange.bind(this)
    this.updateCacheKeyQueryString = this.updateCacheKeyQueryString.bind(this)
  }
  addRule(e) {
    e.preventDefault()
    const defaultPolicies = this.props.config.getIn(['default_policy','policy_rules']).push(Immutable.fromJS(
      {match: {field: null, cases: [['',[]]]}}
    ))
    this.props.changeValue(['default_policy', 'policy_rules'], defaultPolicies)
    this.props.activateRule(['default_policy', 'policy_rules', defaultPolicies.size - 1])
    this.props.activateMatch(['default_policy', 'policy_rules', defaultPolicies.size - 1, 'match'])
  }
  deleteRule(policyType, index) {
    const newPolicies = this.props.config.getIn(['default_policy','policy_rules']).splice(index, 1)
    this.props.changeValue(['default_policy', 'policy_rules'], newPolicies)
  }
  handleChange(path) {
    return value => {
      if(value.target) {
        value = value.target.value
      }
      this.props.changeValue(path, value)
    }
  }
  handleEtagChange(path) {
    return value => {
      this.props.changeValue(path, value)
    }
  }
  changeTTLUnit(path) {
    return unit => {
      let value = this.props.config.getIn(path)
      value = secondsToUnit(value, this.state.ttlUnit)
      value = secondsFromUnit(value, unit)
      this.props.changeValue(path, value)
      this.setState({ttlUnit: unit})
    }
  }
  changeTTLValue(path) {
    return e => {
      const value = secondsFromUnit(e.target.value, this.state.ttlUnit)
      this.props.changeValue(path, value)
    }
  }
  updateCacheKeyQueryString(set) {
    const index = getNameIndex(this.props.config)
    this.props.changeValue(policyPath.push(index,'set','cache_name'), set)
  }
  render() {
    const { config, intl, readOnly } = this.props;
    if(!config || !config.size) {
      return (
        <div className="container"><FormattedMessage id="portal.loading.text"/></div>
      )
    }
    const controlIndex = config.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_control')
        }
      })
    const nameIndex = getNameIndex(config)
    const policyPaths = {
      cache_name: policyPath.push(nameIndex,'set','cache_name'),
      honor_origin_cache_policies: policyPath.push(controlIndex,'set','cache_control','honor_origin'),
      honor_etags: policyPath.push(controlIndex,'set','cache_control','check_etag'),
      max_age: policyPath.push(controlIndex,'set','cache_control','max_age'),
      ignore_case: policyPath.push(nameIndex,'set','cache_name','ignore_case')
    };

    const ttlValue = secondsToUnit(
      config.getIn(policyPaths.max_age),
      this.state.ttlUnit
    )
    const activeEditFormActions = {
      changeValue: this.props.changeValue,
      formatMessage: intl.formatMessage,
      activateSet: this.props.activateSet
    }
    const activeEditForm = getActiveMatchSetForm(
      this.props.activeRule ? config.getIn(this.props.activeRule) : null,
      this.props.activeMatch,
      this.props.activeSet,
      config,
      activeEditFormActions
    )
    return (
      <div className="configuration-defaults">

        {/* Origin Cache Control */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.defaults.originCacheControl.text"/>} />
        <SectionContainer>
          {/* Ignore case from origin */}
          <Row className="form-group">
            <Col lg={4} xs={6} className="toggle-label">
              <FormattedMessage id="portal.policy.edit.defaults.ignoreOriginCase.text"/>
            </Col>
            <Col lg={8} xs={6}>
              <Toggle
                readonly={readOnly}
                value={config.getIn(policyPaths.ignore_case)}
                changeValue={this.handleChange(policyPaths.ignore_case)}/>
            </Col>
          </Row>

          {/* Enable e-Tag support */}
          <Row className="form-group">
            <Col lg={4} xs={6} className="toggle-label">
              <FormattedMessage id="portal.policy.edit.defaults.enableEtag.text"/>
            </Col>
            <Col lg={5} xs={6}>
              <Select className="input-select"
                disabled={readOnly}
                onSelect={this.handleEtagChange(policyPaths.honor_etags)}
                value={config.getIn(policyPaths.honor_etags)}
                options={[
                  ['strong', <FormattedMessage id="portal.policy.edit.defaults.enableEtagStrong.text"/>],
                  ['weak', <FormattedMessage id="portal.policy.edit.defaults.enableEtagWeak.text"/>],
                  ['false', <FormattedMessage id="portal.policy.edit.defaults.enableEtagFalse.text"/>]]}/>
            </Col>
          </Row>

          {/* Honor Origin Cache Control */}
          <Row className="form-group">
            <Col lg={4} xs={6} className="toggle-label">
              <FormattedMessage id="portal.policy.edit.defaults.honorOriginCacheControl.text"/>
            </Col>
            <Col lg={8} xs={6}>
              <Toggle
                readonly={readOnly}
                value={config.getIn(policyPaths.honor_origin_cache_policies)}
                changeValue={this.handleChange(policyPaths.honor_origin_cache_policies)}/>
            </Col>
          </Row>

          <Row className="form-group">
            <Col lg={4} xs={6} className="toggle-label">
              {config.getIn(policyPaths.honor_origin_cache_policies) ?
                <FormattedMessage id="portal.policy.edit.defaults.ttlIfNotPresent.text"/> :
                'CDN TTL'}
            </Col>
            <Col lg={2} xs={3}>
              <Input type="text"
                disabled={readOnly}
                className="ttl-value"
                placeholder={intl.formatMessage({
                  id: 'portal.policy.edit.defaults.timeToLive.text'
                })}
                value={ttlValue}
                onChange={this.changeTTLValue(policyPaths.max_age)}/>
            </Col>
            <Col xs={3}>
              <Select className="input-select"
                disabled={readOnly}
                onSelect={this.changeTTLUnit(policyPaths.max_age)}
                value={this.state.ttlUnit}
                options={[
                  ['seconds', <FormattedMessage id="portal.units.seconds"/>],
                  ['minutes', <FormattedMessage id="portal.units.minutes"/>],
                  ['hours', <FormattedMessage id="portal.units.hours"/>],
                  ['days', <FormattedMessage id="portal.units.days"/>]]}/>
            </Col>
          </Row>
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.defaults.cacheKeyQueryString.text"/>} />
        <SectionContainer>
          <CacheKeyQueryStringForm
            disabled={readOnly}
            horizontal={true}
            intl={intl}
            set={config.getIn(policyPaths.cache_name)}
            updateSet={this.updateCacheKeyQueryString}/>
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.defaults.edgeCacheDefaultRules.text"/>}>
          <IsAllowed to={MODIFY_PROPERTY}>
            <Button bsStyle="success" className="btn-icon"
              onClick={this.addRule}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>

        <SectionContainer>
          <ConfigurationPolicyRules
            defaultPolicies={config.getIn(['default_policy','policy_rules'])}
            activateRule={this.props.activateRule}
            deleteRule={this.deleteRule}/>
          {this.props.activeRule ?
            <ConfigurationSidebar
              rightColVisible={!!activeEditForm}
              handleRightColClose={()=>this.props.activateMatch(null)}
              onHide={()=>this.props.activateRule(null)}
              rightColContent={activeEditForm}>
              <ConfigurationPolicyRuleEdit
                activateMatch={this.props.activateMatch}
                activateSet={this.props.activateSet}
                activeMatchPath={this.props.activeMatch}
                activeSetPath={this.props.activeSet}
                changeValue={this.props.changeValue}
                config={config}
                rule={config.getIn(this.props.activeRule)}
                rulePath={this.props.activeRule}
                changeActiveRuleType={this.changeActiveRuleType}
                hideAction={()=>this.props.activateRule(null)}/>
            </ConfigurationSidebar>
          : ''}
        </SectionContainer>
      </div>
    )
  }
}

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  activateMatch: React.PropTypes.func,
  activateRule: React.PropTypes.func,
  activateSet: React.PropTypes.func,
  activeMatch: React.PropTypes.instanceOf(Immutable.List),
  activeRule: React.PropTypes.instanceOf(Immutable.List),
  activeSet: React.PropTypes.instanceOf(Immutable.List),
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object
}
ConfigurationDefaults.defaultProps = {
  config: Immutable.Map()
}

export default injectIntl(ConfigurationDefaults)
