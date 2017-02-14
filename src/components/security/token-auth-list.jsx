import React, { PropTypes } from 'react'
import {Link} from 'react-router'
import { FormattedMessage } from 'react-intl'
import {formatUnixTimestamp} from '../../util/helpers'

import IsAllowed from '../is-allowed'
import { MODIFY_PROPERTY } from '../../constants/permissions'

import IconEdit from '../icons/icon-edit.jsx'
import IconTrash from '../icons/icon-trash.jsx'

const TokenAuthList = ({ rules, editUrlBuilder }) => {
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

            const routeTo = editUrlBuilder(rule.propertyName, { policyId: rule.ruleId, policyType: 'request_policy' })

            return (
              <tr key={index}>
                <td>{rule.propertyName}</td>
                <td>{rule.encryption}</td>
                <td>{rule.schema}</td>
                <td>**********</td>
                <td>{formatUnixTimestamp(rule.created, 'MM/DD/YYYY hh:mm a')}</td>
                <td className="nowrap-column action-buttons primary">
                  <IsAllowed to={MODIFY_PROPERTY}>
                    <div>
                      <Link
                        to={routeTo('edit')}
                        className='btn btn-icon'>
                        <IconEdit />
                      </Link>
                      <Link to={routeTo('delete')} className='btn btn-icon'><IconTrash /></Link>
                    </div>
                  </IsAllowed>
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
  editUrlBuilder: PropTypes.func,
  rules: PropTypes.array
}
TokenAuthList.defaultProps = {
  rules: []
}

export default TokenAuthList
