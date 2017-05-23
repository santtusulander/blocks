import React, { PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { List } from 'immutable'
import classNames from 'classnames'

import TableSorter from '../shared/table-sorter'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { SHOW_STORAGE_CONTEXT_MENU } from '../../constants/permissions'
import { formatDate, formatBytes } from '../../util/helpers'
import IconFolder from '../shared/icons/icon-folder'
import IconFile from '../shared/icons/icon-file'
import IconBack from '../shared/icons/icon-back'
import ContextMenu from '../shared/page-elements/context-menu'

const StorageContentBrowser = ({
  backButtonHandler,
  contents,
  highlightedItem,
  isRootDirectory,
  openDirectoryHandler,
  sorterProps,
  userDateFormat,
  removeStorageContents
}) => {
  const menuOptions = [
    {
      label: <FormattedMessage id="portal.storage.summaryPage.contentBrowser.menu.download"/>,
      handleClick: (/*fileName*/) => {
        //TODO: Implement download logic
      }
    },
    {
      label: <FormattedMessage id="portal.storage.summaryPage.contentBrowser.menu.delete"/>,
      handleClick: (fileName) => {
        removeStorageContents(fileName)
      }
    }
  ];

  return (
    <Table striped={true} className='storage-contents-table'>
      <thead>
        <tr>
          <th width="1%">
            {!isRootDirectory &&
              <div onClick={backButtonHandler}>
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
          const rowClassnames = classNames(
            {'content-browser-row-directory': isDirectory},
            {'highlight': (highlightedItem === name)}
          )

          return (
            <tr
              key={index}
              {...dataAttributes}
              className={rowClassnames}
              onClick={() => {
                isDirectory ? openDirectoryHandler(name) : null
              }}>
              <td
                className='storage-contents-icon-cell'>
                {isDirectory ? <IconFolder className='storage-contents-icon' /> : <IconFile className='storage-contents-icon' />}
              </td>
              <td>
                <div className='storage-contents-name'>
                  <TruncatedTitle content={name}/>
                </div>
              </td>
              <td>{formatDate(item.get('lastModified'), userDateFormat)}</td>
              <td>{isDirectory ? '-' : formatBytes(item.get('size'))}</td>
              <td>
                <IsAllowed to={SHOW_STORAGE_CONTEXT_MENU}>
                  <ContextMenu header={name} options={menuOptions}/>
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
  highlightedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isRootDirectory: PropTypes.bool,
  openDirectoryHandler: PropTypes.func,
  removeStorageContents: PropTypes.func,
  sorterProps: PropTypes.object,
  userDateFormat: PropTypes.string
}

export default StorageContentBrowser
