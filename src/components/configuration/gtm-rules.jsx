import React from 'react'
import { Table } from 'react-bootstrap'
import { Field, FieldArray } from 'redux-form'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage, injectIntl } from 'react-intl'

import HelpTooltip from '../shared/tooltips/help-tooltip'
import Confirmation from '../shared/page-elements/confirmation'
import ActionButtons from '../shared/action-buttons'
import TruncatedTitle from '../shared/page-elements/truncated-title'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../constants/permissions'

class ConfigurationGTMTrafficRules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: undefined
    }

    this.renderRules = this.renderRules.bind(this)
    this.renderRule = this.renderRule.bind(this)
    this.showConfirmation = this.showConfirmation.bind(this)
    this.toggleConfirmation = this.toggleConfirmation.bind(this)
  }

  showConfirmation(index) {
    return () => {
      this.toggleConfirmation(index)
    }
  }

  toggleConfirmation(activeIndex) {
    this.setState({ activeIndex })
  }

  renderRule({ input, index, fields }) {
    const conditionOptions = {
      'or': "portal.configuration.condition.or",
      'and': "portal.configuration.condition.and"
    }

    const lastIndex = input.value.matchArray.length - 1
    const conditionString = this.props.intl.formatMessage({ id: conditionOptions[input.value.condition] })

    const matches = input.value.matchArray
      .map(({ label }, i) =>
        <span key={i}>
          {label}
          {i < lastIndex && ` ${conditionString} `}
        </span>
      )

    const policyWeight = input.value.policyWeight
    const trafficSplit = policyWeight < 100
      ? <FormattedMessage id="portal.configuration.gtm.table.action.split" values={{ UDNServed: policyWeight, otherServed: 100 - policyWeight }}/>
      : <FormattedMessage id="portal.configuration.gtm.table.action.single" values={{ UDNServed: policyWeight }}/>

    return (
      <tr key={index}>
        <td><TruncatedTitle content={input.value.name} /></td>
        <td>
          <div className="matches">
            <HelpTooltip
              id='gtm-match-tooltip'
              buttonText={matches}
              title={<FormattedMessage id="portal.configuration.gtm.table.match.label"/>}>
              {matches}
            </HelpTooltip>
          </div>
        </td>
        <td>{trafficSplit}</td>
        {!this.props.readOnly &&
          <td className="nowrap-column">
              <ActionButtons
                permissions={{ modify: MODIFY_PROPERTY, delete: DELETE_PROPERTY }}
                onEdit={() => this.props.editRule(index)}
                onDelete={this.showConfirmation(index)} />
            {this.state.activeIndex !== undefined &&
              <ReactCSSTransitionGroup
                component="div"
                className="confirmation-transition"
                transitionName="confirmation-transition"
                transitionEnterTimeout={10}
                transitionLeaveTimeout={500}
                transitionAppear={true}
                transitionAppearTimeout={10}>
                {this.state.activeIndex === index &&
                  <Confirmation
                    cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                    confirmText={this.props.intl.formatMessage({id: 'portal.button.delete'})}
                    handleConfirm={() => {
                      fields.remove(index)
                      this.toggleConfirmation()
                    }}
                    handleCancel={() => this.toggleConfirmation()}>
                    <FormattedMessage id="portal.policy.edit.rules.deleteRuleConfirmation.text"/>
                  </Confirmation>
                }
              </ReactCSSTransitionGroup>
            }
          </td>}
      </tr>
    )
  }

  renderRules({ fields }) {
    return (
      <tbody>
        {fields.map((rule, i) => (
          <Field
            key={i}
            fields={fields}
            index={i}
            name={rule}
            component={this.renderRule}/>
        ))}
        {!fields.length &&
        <tr>
          <td colSpan={4}>
            <FormattedMessage id="portal.configuration.gtm.table.empty.text"/>
          </td>
        </tr>}
      </tbody>
    )
  }

  render() {
    return (
      <div className="configuration-gtm-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th><FormattedMessage id="portal.configuration.gtm.table.name.label"/></th>
              <th><FormattedMessage id="portal.configuration.gtm.table.match.label"/></th>
              <th><FormattedMessage id="portal.configuration.gtm.table.action.label"/></th>
              {!this.props.readOnly && <th width="1%" />}
            </tr>
          </thead>
          <FieldArray
            name="rules"
            activeIndex={this.state.activeIndex}
            component={this.renderRules}/>
        </Table>
      </div>
    )
  }
}

ConfigurationGTMTrafficRules.displayName = 'ConfigurationGTMTrafficRules'
ConfigurationGTMTrafficRules.propTypes = {
  editRule: React.PropTypes.func,
  intl: React.PropTypes.object,
  readOnly: React.PropTypes.bool
}

export default injectIntl(ConfigurationGTMTrafficRules)
