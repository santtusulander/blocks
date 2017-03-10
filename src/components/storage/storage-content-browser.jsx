import React from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import ActionButtons from '../action-buttons'
import IsAllowed from '../is-allowed'
import { MODIFY_STORAGE } from '../../constants/permissions'

const StorageContentBrowser = () => {
  return (
    <Table striped={true}>
      <thead>
        <tr>
          <th><FormattedMessage id={'portal.storage.summaryPage.contentBrowser.lastModified.label'} /></th>
          <th><FormattedMessage id={'portal.storage.summaryPage.contentBrowser.status.label'} /></th>
          <th><FormattedMessage id={'portal.storage.summaryPage.contentBrowser.noOfFiles.label'} /></th>
          <th width="1%"/>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01/19/2017</td>
          <td>In Progress</td>
          <td>-</td>
          <td>
            <IsAllowed to={MODIFY_STORAGE}>
              <ActionButtons onDelete={() => {}} />
            </IsAllowed>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

StorageContentBrowser.displayName = "StorageContentBrowser"

export default StorageContentBrowser
