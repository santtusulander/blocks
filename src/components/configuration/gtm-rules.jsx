import React from 'react'
import { Table } from 'react-bootstrap'
import { Field, FieldArray } from 'redux-form'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage, injectIntl } from 'react-intl'

import HelpTooltip from '../help-tooltip'
import Confirmation from '../confirmation'
import ActionButtons from '../../components/action-buttons'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../../constants/permissions'

class ConfigurationGTMTrafficRules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rule: null
    }

    this.deleteRule = this.deleteRule.bind(this)
    this.renderRules = this.renderRules.bind(this)
    this.renderRule = this.renderRule.bind(this)
    this.showConfirmation = this.showConfirmation.bind(this)
    this.closeConfirmation = this.closeConfirmation.bind(this)
  }

  deleteRule(index, remove) {
    return () => {
      remove(index)
      this.closeConfirmation()
    }
  }

  showConfirmation(index) {
    return () => {
      this.setState({
        rule: index
      })
    }
  }

  closeConfirmation() {
    this.setState({
      rule: null
    })
  }

  renderRule({ input, index, fields }) {
    const conditionOptions = {
      'or': <FormattedMessage id="portal.configuration.condition.or" />,
      'and': <FormattedMessage id="portal.configuration.condition.and" />
    }
    const matches = input.value.matchArray.map(({ label }) => label).join(conditionOptions[input.value.condition])
    const policyWeight = input.value.policyWeight
    const trafficSplit = policyWeight < 100
      ? <FormattedMessage id="portal.configuration.gtm.table.action.split" values={{ UDNServed: policyWeight, otherServed: 100 - policyWeight }}/>
      : <FormattedMessage id="portal.configuration.gtm.table.action.single" values={{ UDNServed: policyWeight }}/>

    return (
      <tr key={index}>
        <td>{input.value.name}</td>
        <td>
          <HelpTooltip
            id='gtm-match-tooltip'
            buttonText={matches}
            title={<FormattedMessage id="portal.configuration.gtm.table.match.label"/>}>
            {matches}
          </HelpTooltip>
        </td>
        <td>{trafficSplit}%</td>
        <td className="nowrap-column">
          {!this.props.readOnly &&
            <ActionButtons
              permissions={{ modify: MODIFY_PROPERTY, delete: DELETE_PROPERTY }}
              onEdit={() => this.props.editRule(index)}
              onDelete={this.showConfirmation(index)} />}
          {this.state.rule !== null &&
            <ReactCSSTransitionGroup
              component="div"
              className="confirmation-transition"
              transitionName="confirmation-transition"
              transitionEnterTimeout={10}
              transitionLeaveTimeout={500}
              transitionAppear={true}
              transitionAppearTimeout={10}>
              {this.state.rule === index &&
                <Confirmation
                  cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                  confirmText={this.props.intl.formatMessage({id: 'portal.button.delete'})}
                  handleConfirm={this.deleteRule(index, fields.remove)}
                  handleCancel={this.closeConfirmation}>
                  <FormattedMessage id="portal.policy.edit.rules.deleteRuleConfirmation.text"/>
                </Confirmation>
              }
            </ReactCSSTransitionGroup>
          }
        </td>
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
              <th width="1%" />
            </tr>
          </thead>
          <FieldArray
            name="rules"
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
