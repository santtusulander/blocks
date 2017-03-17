import React, { PropTypes } from 'react'
import {Link} from 'react-router'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {formatUnixTimestamp} from '../../util/helpers'

import IsAllowed from '../is-allowed'
import { MODIFY_PROPERTY } from '../../constants/permissions'

import IconEdit from '../icons/icon-edit.jsx'
import IconTrash from '../icons/icon-trash.jsx'

import { SCHEMA_OPTIONS, ENCRYPTION_OPTIONS } from '../../constants/configuration'

const TokenAuthList = ({ rules, editUrlBuilder, intl }) => {
  const schemaOptions = SCHEMA_OPTIONS.map(({value, label}) => ({value, label: intl.formatMessage({id: label}) }))
  const getSchemaLabel = (schema) => {
    return schema.reduce((acc, schema) => {
      return acc.concat([schemaOptions.find(option => option.value === schema).label])
    }, []).join(' + ')
  }

  const getEncryptionLabel = (value) => ENCRYPTION_OPTIONS.find(item => item.value === value).label

  return (
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.property.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.type.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.encryption.text"/></th>
            <th width="20%"><FormattedMessage id="portal.security.tokenAuth.schema.text"/></th>
            <th width="19%"><FormattedMessage id="portal.security.tokenAuth.created.text"/></th>
            <IsAllowed to={MODIFY_PROPERTY}>
              <th width="1%" />
            </IsAllowed>
          </tr>

        </thead>
        <tbody>
          { rules.map( (rule, index) => {

            const routeTo = editUrlBuilder(rule.propertyName, { policyId: rule.ruleId, policyType: 'request_policy' })

            return (
              <tr key={index}>
                <td>{rule.propertyName}</td>
                <td>{intl.formatMessage({id: rule.type})}</td>
                <td>{getEncryptionLabel(rule.encryption)}</td>
                <td>{getSchemaLabel(rule.schema)}</td>
                <td>{formatUnixTimestamp(rule.created, 'MM/DD/YYYY hh:mm a')}</td>
                <IsAllowed to={MODIFY_PROPERTY}>
                  <td className="nowrap-column action-buttons primary">
                    <div>
                      <Link
                        to={routeTo('edit')}
                        className='btn btn-icon'>
                        <IconEdit />
                      </Link>
                      <Link to={routeTo('delete')} className='btn btn-icon'><IconTrash /></Link>
                    </div>
                  </td>
                </IsAllowed>
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
  intl: intlShape.isRequired,
  rules: PropTypes.array
}
TokenAuthList.defaultProps = {
  rules: []
}

export default injectIntl(TokenAuthList)
