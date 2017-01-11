import React, {PropTypes} from 'react'
import {Table, Tr, Td, Thead, Th} from 'reactable'
import {injectIntl} from 'react-intl'
import Immutable from 'immutable'
import IconArrowDown from '../../components/icons/icon-arrow-down.jsx'
import IconArrowUp from '../../components/icons/icon-arrow-up.jsx'
import LineChart from '../charts/line-chart'

import { formatBitsPerSecond, formatRequests } from '../../util/helpers'

const TrafficByCountryTable = ({byCountry, recordType, intl, onSort, sortDirection}) => {

  const byCountryChartDataKey = recordType === 'transfer_rates'
    ? 'bits_per_second'
    : 'requests'

  const byCountryDataKey = recordType === 'transfer_rates'
    ? 'average_bits_per_second'
    : 'requests'

  const byCountryDataFormat = recordType === 'transfer_rates'
    ? val => formatBitsPerSecond(val, true)
    : val => formatRequests(val)

  const transferRate = recordType === 'transfer_rates'
  ? intl.formatMessage({id: "portal.analytics.trafficOverview.bandwith.text"})
  : intl.formatMessage({id: "portal.analytics.trafficOverview.requests.text"})

  const renderSortIcon = sortDirection === 1 ? <IconArrowDown /> : <IconArrowUp />

  return (
    <Table className="table table-striped table-analysis" sortable={['Country', transferRate]} defaultSort={{column: transferRate, direction: 'asc'}} onSort={onSort.bind(this)}>
    <Thead>
      <Th column="Country">Country {renderSortIcon}</Th>
      <Th column={transferRate}>{transferRate} {renderSortIcon}</Th>
      <Th>Period Trend</Th>
    </Thead>
    {
      byCountry && byCountry.map( (country,i) => {
        return (
          <Tr key={i}>
            <Td column="Country" data={country.get('name')} />
            <Td
              column={transferRate}
              data={byCountryDataFormat(country.get(byCountryDataKey))}
            />
            <Td column="Period Trend">
              <LineChart data={country && country.get('detail') && country.get('detail').toJS()} dataKey={byCountryChartDataKey}/>
            </Td>
          </Tr>
        )
      })
    }
    </Table>
  )
}

TrafficByCountryTable.displayName = 'TrafficByCountryTable'

TrafficByCountryTable.propTypes = {
  byCountry: PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  onSort: PropTypes.func,
  recordType: PropTypes.string,
  sortDirection: PropTypes.number
}

export default injectIntl(TrafficByCountryTable)
