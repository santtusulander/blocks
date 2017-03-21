import React from 'react'
import { Table } from 'react-bootstrap'
import Immutable from 'immutable'
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
      policy: null
    }

    this.editRule = this.editRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
    this.parsePolicy = this.parsePolicy.bind(this)
    this.renderRules = this.renderRules.bind(this)
    this.showConfirmation = this.showConfirmation.bind(this)
    this.closeConfirmation = this.closeConfirmation.bind(this)
  }

  editRule(index) {
    return () => {
      this.props.editRule(index)
    }
  }

  deleteRule(index) {
    return () => {
      this.props.deleteRule(index)
      this.setState({
        policy: null
      })
    }
  }

  showConfirmation(index) {
    return () => {
      this.setState({
        policy: index
      })
    }
  }

  closeConfirmation() {
    this.setState({
      policy: null
    })
  }

  parsePolicy() {
    /* TODO: UDNP-3088 - Rules section */
    return {
      matches: [{ field: 'a, b, c, d'}, { field: 'a, b, c, d'}],
      sets: [{ setkey: 'd, c, b, a'}, { setkey: 'd, c, b, a'}]
    }
  }

  renderRules(policy, i) {
    /* TODO: fix this function in scope of UDNP-3088 - Rules section */
    if (!policy.has('match')) {
      return null
    }

    const { matches, sets } = this.parsePolicy(policy)

    let matchLabel = matches.map(match => match.field).join(', ')
    let actionsLabel = sets.map(set => set.setkey).join(', ')

    const actionButtons = this.props.readOnly ? null : (
      <ActionButtons
        permissions={{ modify: MODIFY_PROPERTY, delete: DELETE_PROPERTY }}
        onEdit={this.editRule(i)}
        onDelete={this.showConfirmation(i)} />
    )

    return (
      <tr key={policy + i}>
        <td>{policy.get('rule_name')}</td>
        <td>
          <HelpTooltip
            id='gtm-match-tooltip'
            buttonText={matchLabel}
            title={<FormattedMessage id="portal.configuration.gtm.table.match.label"/>}>
            {matchLabel}
          </HelpTooltip>
        </td>
        <td>{actionsLabel}</td>
        <td className="nowrap-column">
          {actionButtons}
          {this.state.policy !== null &&
            <ReactCSSTransitionGroup
              component="div"
              className="confirmation-transition"
              transitionName="confirmation-transition"
              transitionEnterTimeout={10}
              transitionLeaveTimeout={500}
              transitionAppear={true}
              transitionAppearTimeout={10}>
              {this.state.policy === i &&
                <Confirmation
                  cancelText={this.props.intl.formatMessage({id: 'portal.button.no'})}
                  confirmText={this.props.intl.formatMessage({id: 'portal.button.delete'})}
                  handleConfirm={this.deleteRule(i)}
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

  render() {
    /* TODO: UDNP-3088 - Rules section */
    const rows = [
      ...this.props.rules.map(this.renderRules)
    ]

    return (
      <div className="configuration-gtm-rules">
        <Table striped={true}>
          <thead>
            <tr>
              <th><FormattedMessage id="portal.configuration.gtm.table.name.label"/></th>
              <th><FormattedMessage id="portal.configuration.gtm.table.match.label"/></th>
              <th><FormattedMessage id="portal.configuration.gtm.table.actions.label"/></th>
              <th width="1%" />
            </tr>
          </thead>
          <tbody>
            {this.props.rules.isEmpty()
              ?
                <tr>
                  <td colSpan={5}>
                    <FormattedMessage id="portal.configuration.gtm.table.empty.text"/>
                  </td>
                </tr>
              :
                rows
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

ConfigurationGTMTrafficRules.displayName = 'ConfigurationGTMTrafficRules'
ConfigurationGTMTrafficRules.propTypes = {
  deleteRule: React.PropTypes.func,
  editRule: React.PropTypes.func,
  intl: React.PropTypes.object,
  readOnly: React.PropTypes.bool,
  rules: React.PropTypes.instanceOf(Immutable.List)
}

/* TODO: UDNP-3088 - Rules section */
ConfigurationGTMTrafficRules.defaultProps = {
  rules: Immutable.fromJS([{
    "rule_name": "First Rule",
    "match": {
      "field": "response_code",
      "cases": [
        [
          "307",
          [
            {
              "match": {
                "field": "response_header",
                "cases": [
                  [
                    "origin1.example.com/(.*)",
                    [
                      {
                        "set": {
                          "header": {
                            "action": "set",
                            "header": "Location",
                            "value": [
                              {
                                "field": "text",
                                "field_detail": "origin2.example.com/"
                              },
                              {
                                "field": "group",
                                "field_detail": "1"
                              }
                            ]
                          }
                        }
                      }
                    ]
                  ]
                ],
                "field_detail": "Location"
              }
            }
          ]
        ]
      ]
    }
  }, {
    "rule_name": "Second Rule",
    "match": {
      "field": "response_code",
      "cases": [
        [
          "307",
          [
            {
              "match": {
                "field": "response_header",
                "cases": [
                  [
                    "origin1.example.com/(.*)",
                    [
                      {
                        "set": {
                          "header": {
                            "action": "set",
                            "header": "Location",
                            "value": [
                              {
                                "field": "text",
                                "field_detail": "origin2.example.com/"
                              },
                              {
                                "field": "group",
                                "field_detail": "1"
                              }
                            ]
                          }
                        }
                      }
                    ]
                  ]
                ],
                "field_detail": "Location"
              }
            }
          ]
        ]
      ]
    }
  }])
}

export default injectIntl(ConfigurationGTMTrafficRules)
