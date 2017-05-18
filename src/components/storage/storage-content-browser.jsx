import React, { PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { List } from 'immutable'

import TableSorter from '../shared/table-sorter'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import ActionButtons from '../shared/action-buttons'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { MODIFY_STORAGE } from '../../constants/permissions'
import { formatDate, formatBytes } from '../../util/helpers'
import IconFolder from '../shared/icons/icon-folder'
import IconFile from '../shared/icons/icon-file'
import IconBack from '../shared/icons/icon-back'

const StorageContentBrowser = ({
  backButtonHandler,
  contents,
  highlightedItem,
  isRootDirectory,
  openDirectoryHandler,
  sorterProps
}) => {
  return (
    <Table striped={true} className='storage-contents-table'>
      <thead>
        <tr>
          <th width="1%">
            {!isRootDirectory &&
              <div onDoubleClick={backButtonHandler}>
                <IconBack
                  className='storage-contents-icon back'
                  height={20}
                  viewBox='0 0 36 20' />
              </div>
            }
          </th>
          <TableSorter {...sorterProps} column='name'>
            <FormattedMessage id='portal.storage.summaryPage.contentBrowser.name.label' />
          </TableSorter>
          <TableSorter {...sorterProps} column='lastModified'>
            <FormattedMessage id='portal.storage.summaryPage.contentBrowser.lastModified.label' />
          </TableSorter>
          <TableSorter {...sorterProps} column='size'>
            <FormattedMessage id='portal.storage.summaryPage.contentBrowser.size.label' />
          </TableSorter>
          <th width="1%"/>
        </tr>
      </thead>
      <tbody className={`${(highlightedItem === null) ? 'highlight' : ''}`}>
        {contents.map((item, index) => {
          const name = item.get('name')
          const isDirectory = item.get('type') === 'directory'
          const dataAttributes = {
            'data-drop-zone': true
          }
          if (isDirectory) {
            dataAttributes['data-drop-dir'] = name
          }
          return (
            <tr
              key={index}
              {...dataAttributes}
              className={`${(highlightedItem === name) ? 'highlight' : ''}`}>
              <td
                className='storage-contents-icon-cell'>
                {isDirectory ? <IconFolder className='storage-contents-icon' /> : <IconFile className='storage-contents-icon' />}
              </td>
              <td
                onDoubleClick={() => {
                  isDirectory ? openDirectoryHandler(name) : null
                }}
              >
                <div className='storage-contents-name'>
                  <TruncatedTitle content={name} />
                </div>
              </td>
              <td>{formatDate(item.get('lastModified'))}</td>
              <td>{isDirectory ? '-' : formatBytes(item.get('size'))}</td>
              <td>
                <IsAllowed to={MODIFY_STORAGE}>
                  <ActionButtons onDelete={() => {
                    // no-op
                  }} />
                </IsAllowed>
              </td>
            </tr>
          )
        })
      }
      </tbody>
    </Table>
  )
}

StorageContentBrowser.displayName = "StorageContentBrowser"
StorageContentBrowser.propTypes = {
  backButtonHandler: PropTypes.func,
  contents: PropTypes.instanceOf(List),
  highlightedItem: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
  isRootDirectory: PropTypes.bool,
  openDirectoryHandler: PropTypes.func,
  sorterProps: PropTypes.object
}

export default StorageContentBrowser
