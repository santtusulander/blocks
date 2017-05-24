import React, { PropTypes, Component } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { List } from 'immutable'
import classNames from 'classnames'

import StorageItemProperties from './storage-item-properties'
import TableSorter from '../shared/table-sorter'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { SHOW_STORAGE_CONTEXT_MENU } from '../../constants/permissions'
import { formatDate, formatBytes } from '../../util/helpers'
import IconFolder from '../shared/icons/icon-folder'
import IconFile from '../shared/icons/icon-file'
import IconBack from '../shared/icons/icon-back'
import ContextMenu from '../shared/page-elements/context-menu'
import IconCaretDown from '../shared/icons/icon-caret-down'

class StorageContentBrowser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expandedProperties: null
    }
  }

  setExpandedProperties(expandedProperties) {
    this.setState({ expandedProperties })
  }

  render() {
    const {
      backButtonHandler,
      contents,
      highlightedItem,
      isRootDirectory,
      openDirectoryHandler,
      params,
      removeStorageContents,
      sorterProps,
      userDateFormat
    } = this.props

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
            <th/>
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
            const type = item.get('type')
            const created = item.get('created')
            const lastModified = item.get('lastModified')
            const size = item.get('size')
            const isDirectory = type === 'directory'
            const isPropertiesOpen = this.state.expandedProperties === name
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

            const menuOptions = [
              {
                label: <FormattedMessage id="portal.storage.summaryPage.contentBrowser.menu.download"/>,
                handleClick: (/*fileName*/) => {
                  //TODO: Implement download logic
                }
              },
              {
                label: <FormattedMessage id="portal.storage.summaryPage.contentBrowser.menu.delete"/>,
                handleClick: () => removeStorageContents(name)
              }
            ]

            const row = [
              <tr
                key={index}
                {...dataAttributes}
                className={rowClassnames}
                onClick={() => {
                  isDirectory ? openDirectoryHandler(name) : null
                }}>
                <td
                  className='storage-contents-cell no-border'>
                  {isDirectory ? <IconFolder className='storage-contents-icon' /> : <IconFile className='storage-contents-icon' />}
                </td>
                <td
                  className='storage-contents-cell no-border'
                  onClick={(e) => {
                    e.stopPropagation()
                    isPropertiesOpen
                      ?
                        this.setExpandedProperties(null)
                      :
                        this.setExpandedProperties(name)
                  }}>
                  <IconCaretDown className={classNames('storage-item-properties-icon', {'selected': isPropertiesOpen})}/>
                </td>
                <td>
                  <div className='storage-contents-name'>
                    <TruncatedTitle content={name} />
                  </div>
                </td>
                <td>{formatDate(lastModified, userDateFormat)}</td>
                <td>{isDirectory ? '-' : formatBytes(size)}</td>
                <td>
                  <IsAllowed to={SHOW_STORAGE_CONTEXT_MENU}>
                    <ContextMenu header={name} options={menuOptions}/>
                  </IsAllowed>
                </td>
              </tr>
            ]

            let rowData
            if (isPropertiesOpen) {
              rowData = row.concat([
                <tr className="storage-item-properties-row">
                  <td colSpan="6">
                    <StorageItemProperties
                      isDirectory={isDirectory}
                      created={created}
                      lastModified={lastModified}
                      name={name}
                      size={size}
                      dateFormat={userDateFormat}
                      params={params}
                    />
                  </td>
                </tr>,
                <tr />
              ])
            } else {
              rowData = row
            }

            return rowData
          })
          }
        </tbody>
      </Table>
    )
  }
}

StorageContentBrowser.displayName = "StorageContentBrowser"
StorageContentBrowser.propTypes = {
  backButtonHandler: PropTypes.func,
  contents: PropTypes.instanceOf(List),
  highlightedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isRootDirectory: PropTypes.bool,
  openDirectoryHandler: PropTypes.func,
  params: PropTypes.object,
  removeStorageContents: PropTypes.func,
  sorterProps: PropTypes.object,
  userDateFormat: PropTypes.string
}

export default StorageContentBrowser
