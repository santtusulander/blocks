import React, { PropTypes } from 'react'
import {Link} from 'react-router'
import { FormattedMessage } from 'react-intl'
import {formatUnixTimestamp} from '../../util/helpers'
import IconEdit from '../icons/icon-edit.jsx'
import IconTrash from '../icons/icon-trash.jsx'

const TokenAuthList = ({rules}) => {
  return (
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.property.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.encryption.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.schema.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.sharedSecretValue.text"/></th>
            <th width="19%"><FormattedMessage id="portal.security.tokenAuth.created.text"/></th>
            <th width="1%" />
          </tr>

        </thead>
        <tbody>
          { rules.map( (rule, index) => {
            return (
              <tr key={index}>
                <td>{rule.propertyName}</td>
                <td>{rule.encryption}</td>
                <td>{rule.schema}</td>
                <td>**********</td>
                <td>{formatUnixTimestamp(rule.created, 'MM/DD/YYYY hh:mm a')}</td>
                <td className="nowrap-column">
                    <Link to='/ruledit/' className='btn btn-icon'><IconEdit /></Link>
                    <Link to='/ruledelete/' className='btn btn-icon'><IconTrash /></Link>
                </td>
              </tr>
            )
          })}

          { rules.length === 0 && <tr id="empty-msg"><td colSpan="6"><FormattedMessage id="portal.security.tokenAuth.noRules.text"/></td></tr>}
        </tbody>
      </table>
  )
}

TokenAuthList.displayName = 'TokenAuthList'

TokenAuthList.propTypes = {
  rules: PropTypes.array
}
TokenAuthList.defaultProps = {
  rules: []
}

export default TokenAuthList
