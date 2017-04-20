import React, { PropTypes, Component } from 'react'
import { FormattedMessage } from 'react-intl'

import IsAllowed from '../is-allowed'
import TableSorter from '../table-sorter'
import { MODIFY_RECORD } from '../../constants/permissions'

export class DNSRecordTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortDirection: 1
    }
  }

  render() {
    const { state: { sortDirection }, props: { shouldHavePrio, content } } = this
    /**
     * Sorting function
     */
    const sort = array =>
      array.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1 * sortDirection
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1 * sortDirection
        }
        return 0
      })
    const changeSort = (column, direction) => this.setState({ sortDirection: direction })
    const sorterProps = {
      activateSort: changeSort,
      activeDirection: sortDirection,
      activeColumn: 'name'
    }
    return (
      <table className="table table-striped cell-text-left">
        <thead >
        <tr>
          <TableSorter {...sorterProps} column="name" width="30%"><FormattedMessage id='portal.account.dnsList.hostname.header' /></TableSorter>
          <th width="30%"><FormattedMessage id='portal.account.dnsList.address.header' /></th>
          <th width="30%"><FormattedMessage id='portal.account.dnsList.ttl.header' /></th>
          {shouldHavePrio && <th width="30%"><FormattedMessage id='portal.account.dnsList.prio.header' /></th>}
          <IsAllowed to={MODIFY_RECORD}>
            <th width="1%" />
          </IsAllowed>
        </tr>
        </thead>
        <tbody>
        {content(sort)}
        </tbody>
      </table>
    )
  }
}

DNSRecordTable.displayName = "DNSRecordTable"
DNSRecordTable.propTypes = {
  content: PropTypes.func,
  shouldHavePrio: PropTypes.bool
}
