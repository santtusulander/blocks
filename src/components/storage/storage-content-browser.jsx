import React, { PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import ActionButtons from '../shared/action-buttons'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { MODIFY_STORAGE } from '../../constants/permissions'
import { formatDate } from '../../util/helpers'

const StorageContentBrowser = ({ contents }) => {
  return (
    <Table striped={true}>
      <thead>
        <tr>
          <th><FormattedMessage id='portal.storage.summaryPage.contentBrowser.lastModified.label' /></th>
          <th><FormattedMessage id='portal.storage.summaryPage.contentBrowser.status.label' /></th>
          <th><FormattedMessage id='portal.storage.summaryPage.contentBrowser.noOfFiles.label' /></th>
          <th width="1%"/>
        </tr>
      </thead>
      <tbody>
        {contents.map((item, index) => (
          <tr key={index}>
            <td>{formatDate(item.lastModified)}</td>
            <td>{item.status}</td>
            <td>{item.type === 'directory' ? item.noOfFiles : '-'}</td>
            <td>
              <IsAllowed to={MODIFY_STORAGE}>
                <ActionButtons onDelete={() => {
                  // no-op
                }} />
              </IsAllowed>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

StorageContentBrowser.displayName = "StorageContentBrowser"
StorageContentBrowser.propTypes = {
  contents: PropTypes.array
}

export default StorageContentBrowser
