import React, { PropTypes } from 'react'
import {Link} from 'react-router'
import { FormattedMessage, FormattedDate, injectIntl, intlShape } from 'react-intl'
import { unixTimestampToDate } from '../../util/helpers'

import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { MODIFY_PROPERTY } from '../../constants/permissions'

import IconEdit from '../shared/icons/icon-edit.jsx'
import IconTrash from '../shared/icons/icon-trash.jsx'

import { SCHEMA_OPTIONS, ENCRYPTION_OPTIONS } from '../../constants/configuration'
import { DATE_FORMATS } from '../../constants/date-formats'

const TokenAuthList = ({ rules, editUrlBuilder, intl }) => {
  const schemaOptions = SCHEMA_OPTIONS.map(({value, label}) => ({value, label: intl.formatMessage({id: label}) }))
  const getSchemaLabel = (schema) => {
    return schema.reduce((acc, singleSchema) => {
      return acc.concat([schemaOptions.find(option => option.value === singleSchema).label])
    }, []).join(' + ')
  }

  const getEncryptionLabel = ({encryption, streaming_encryption}) => {
    if (streaming_encryption) {
      return `${intl.formatMessage({id: 'portal.security.tokenAuth.manifest.text'})}: ${ENCRYPTION_OPTIONS.find(item => item.value === encryption).label}
              ${intl.formatMessage({id: 'portal.security.tokenAuth.chunk.text'})}: ${ENCRYPTION_OPTIONS.find(item => item.value === streaming_encryption).label}`
    } else {
      return ENCRYPTION_OPTIONS.find(item => item.value === encryption).label
    }
  }

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
          { rules.map((rule, index) => {

            const routeTo = editUrlBuilder(rule.propertyName, { policyId: rule.ruleId, policyType: 'request_policy' })

            return (
              <tr key={index}>
                <td>{rule.propertyName}</td>
                <td>{intl.formatMessage({id: rule.type})}</td>
                <td>{getEncryptionLabel(rule)}</td>
                <td>{getSchemaLabel(rule.schema)}</td>
                <td><FormattedDate value={unixTimestampToDate(rule.created)} format={DATE_FORMATS.DATE_HOUR_12}/></td>
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
