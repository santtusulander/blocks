import React from 'react'
import { FormattedMessage } from 'react-intl'

import * as entitySelectors from '../../entity/selectors'

/*eslint-disable react/display-name*/
/*eslint-disable react/no-multi-comp*/
const labels = {
  asn: labelText => <FormattedMessage id="portal.configuration.traffic.rules.match.asn.items" values={{ items: labelText }} />,
  continent: labelText => <FormattedMessage id="portal.configuration.traffic.rules.match.continent.items" values={{ items: labelText }} />,
  country: labelText => <FormattedMessage id="portal.configuration.traffic.rules.match.country.items" values={{ items: labelText }} />,
  ipv4_address: labelText => <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.items" values={{ items: labelText }} />,
  ipv4_cidr_prefix: labelText => <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr.items" values={{ items: labelText }} />
}

export const getById = (state, propertyId) => entitySelectors.getEntityById(state, 'gtm', propertyId)

export const formatConfigToInitialValues = (state, propertyId) => {
  const gtmConfig = getById(state, propertyId)

  if (gtmConfig) {

    let thirdPartyCDNName = undefined
    let amountServedByUDN = '50'
    const asnMatches = gtmConfig.get('asns')
    let rowServedByThirdParty = false

    const aggregatedRules = gtmConfig.get('rules').toJS().reduce((aggregate, rule) => {

      const hasNegativeMatch = rule.request_match.negative_match

      if (!hasNegativeMatch) {

        const matchType = rule.request_match.type
        let matchValue = rule.request_match.value
        let labelValue = matchValue

        if (matchType === 'no_filter' && matchValue === '{%customer_cname%}') {
          rowServedByThirdParty = true
        }
        if (matchType === 'asn') {

          matchValue =
            asnMatches
            .find((asn) => asn.get('id') === rule.request_match.value).toJS()

          labelValue = matchValue.label
        }

        if (aggregate.rules[rule.rule_name]) {
          aggregate.labels[rule.rule_name] = aggregate.labels[rule.rule_name].concat(', ' + labelValue)
          aggregate.values[rule.rule_name].push(matchValue)
          const aggregatedLabel = aggregate.labels[rule.rule_name]
          const aggregatedValue = aggregate.values[rule.rule_name]

          aggregate.rules[rule.rule_name].matchArray = [
            {
              label: labels[matchType](aggregatedLabel),
              matchType,
              values: {
                [matchType]: aggregatedValue
              }
            }
          ]

        } else {
          aggregate.labels[rule.rule_name] = labelValue
          aggregate.values[rule.rule_name] = [ matchValue ]

          // get amount of traffic being served via UDN
          // and the name of third party CDN
          rule.traffic_split_targets.forEach(target => {

            if (target.cname === '{%customer_cname%}') {
              amountServedByUDN = target.percent
            } else {
              thirdPartyCDNName = target.cname
            }

          })

          aggregate.rules[rule.rule_name] = {
            name: rule.rule_name,
            condition: 'or',
            policyWeight: amountServedByUDN,
            matchArray: [
              {
                label: labels[matchType](labelValue),
                matchType,
                values: {
                  [matchType]: [matchValue]
                }
              }
            ]
          }
        }
      }

      return aggregate
    }, { labels: {}, values: {}, rules: {} })
    const rules = aggregatedRules.rules
    const rulesArray = Object.keys(rules).map(ruleName => rules[ruleName])

    return {
      GTMToggle: true,
      ttl: gtmConfig.get('ttl'),
      cdnName: thirdPartyCDNName,
      cName: gtmConfig.get('title'),
      ROWToggle: rowServedByThirdParty,
      rules: rulesArray
    }
  }
}
