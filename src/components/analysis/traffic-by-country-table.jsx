import React, {PropTypes} from 'react'
import {Table, Tr, Td} from 'reactable'
import {injectIntl} from 'react-intl'
import Immutable from 'immutable'
import numeral from 'numeral'

import TinyAreaChart from '../charts/tiny-area-chart'

import { formatBitsPerSecond } from '../../util/helpers'

const TrafficByCountryTable = ({byCountry, recordType, intl}) => {

  const byCountryChartDataKey = recordType === 'transfer_rates'
    ? 'bits_per_second'
    : 'requests'

  const byCountryDataFormat = recordType === 'transfer_rates'
    ? val => formatBitsPerSecond(val, true)
    : val => numeral(val).format('0,0')

  const byCountryDataKey = recordType === 'transfer_rates'
    ? 'average_bits_per_second'
    : 'requests'

  return (
    <Table className="table" sortable={true} >
    {
      byCountry && byCountry.map( (country,i) => {
        return (
          <Tr key={i}>
            <Td column="Country" data={country.get('name')}/>
            <Td
              column={recordType === 'transfer_rates'
              ? intl.formatMessage({id: "portal.analytics.trafficOverview.bandwith.text"})
              : intl.formatMessage({id: "portal.analytics.trafficOverview.requests.text"})
              }
              data={byCountryDataFormat(country.get(byCountryDataKey))}
            />
            <Td column="Period Trend">
              <TinyAreaChart data={country && country.get('detail') && country.get('detail').toJS()} dataKey={byCountryChartDataKey}/>
            </Td>
          </Tr>
        )
      })
    }
    </Table>
  )
}

TrafficByCountryTable.propTypes = {
  byCountry: PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  recordType: PropTypes.string
}

export default injectIntl(TrafficByCountryTable)
