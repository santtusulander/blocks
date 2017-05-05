import React from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import continentList from '../../../../constants/continents'
import countryList from '../../../../constants/three-digit-countries'

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

export const getById = (state, propertyId) => entitySelectors.getEntityById(state, 'gtm', `${propertyId}-GTM`)

export const formatConfigToInitialValues = (state, propertyId, formatMessage) => {
  const gtmConfig = getById(state, propertyId)

  if (gtmConfig && gtmConfig.size) {

    let thirdPartyCName = undefined
    let amountServedByUDN = '50'
    const asnMatches = gtmConfig.get('asns') || List()
    let ttl = 0
    let rowServedByThirdParty = false
    const udnPlaceholder = 'UDN'//'{%customer_cname%}'

    const aggregatedRules = gtmConfig.get('rules').toJS().reduce((aggregate, rule) => {

      const hasNegativeMatch = rule.request_match.negative_match

      const matchType = rule.request_match.type
      const matchValue = rule.request_match.value
      let labelValue = matchValue

      if (matchType === 'no_filter' && rule.response_value.value !== udnPlaceholder) {
        rowServedByThirdParty = true
      }

      if (!hasNegativeMatch && matchType !== 'no_filter') {

        if (matchType === 'asn') {

          for (const asn of asnMatches.toJS()) {
            if (asn.id === rule.request_match.value) {
              labelValue = asn.label
              break
            }
          }

        } else if (matchType === 'country') {

          labelValue = countryList.find(({ id }) => id === matchValue).label

        } else if (matchType === 'continent') {
          labelValue = formatMessage({

            id: continentList.find(({ id }) => id === matchValue).labelId

          })

        }

        if (aggregate.rules[rule.rule_name]) {

          aggregate.labels[rule.rule_name] = aggregate.labels[rule.rule_name].concat(', ' + labelValue)
          aggregate.values[rule.rule_name].push({ id: matchValue, label: labelValue })
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
          aggregate.values[rule.rule_name] = [ { id: matchValue, label: labelValue } ]

          // get amount of traffic being served via UDN
          // and the name of third party CDN
          rule.traffic_split_targets.forEach(target => {

            if (target.cname === udnPlaceholder) {
              ttl = Number(target.ttl)
              amountServedByUDN = target.percent

            } else {
              thirdPartyCName = target.cname
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
                  [matchType]: aggregate.values[rule.rule_name]
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
      ttl,
      cdnName: gtmConfig.get('title'),
      cName: thirdPartyCName,
      ROWToggle: rowServedByThirdParty,
      rules: rulesArray
    }
  }
}
