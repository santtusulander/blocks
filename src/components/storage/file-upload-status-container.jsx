import React, { PropTypes } from 'react'
import { Button, Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import StatusItem from './file-upload-status-item'
import IconHeaderCaret from '../icons/icon-header-caret'

class FileUploadStatus extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true
    }

    this.toggleFilesList = this.toggleFilesList.bind(this)
  }

  toggleFilesList() {
    this.setState({open: !this.state.open})
  }

  render() {
    const { uploads, inlineStyle, cancelAll } = this.props
    return (
      <div className='file-upload-status-wrapper' style={inlineStyle}>
        <div className='file-upload-status-header'>
          <FormattedMessage
            id="portal.storage.uploadContent.uploading.text"
            values={{number: uploads.length}} />
          <Button
            bsStyle='link'
            className='file-upload-status-header-caret'
            onClick={this.toggleFilesList}
            >
            <IconHeaderCaret
              className={classNames('caret-icon', {'upward': !this.state.open})} />
          </Button>
        </div>
        <Panel collapsible={true} expanded={this.state.open} className='file-upload-status-body'>
          <div className='file-upload-status-cancel-link'>
            <Button
              bsStyle="link"
              onClick={() => cancelAll(uploads)}>
              <FormattedMessage id="portal.storage.uploadContent.cancel.text" />
            </Button>
          </div>
          {uploads.map((data, index) => <StatusItem key={index} {...data} />)}
        </Panel>
      </div>
    )
  }
}

FileUploadStatus.displayName = "FileUploadStatus"
FileUploadStatus.propTypes = {
  cancelAll: PropTypes.func,
  inlineStyle: PropTypes.object,
  uploads: PropTypes.array
}

export default FileUploadStatus
