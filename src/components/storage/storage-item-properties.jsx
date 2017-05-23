import React, { PropTypes, Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as uiActionCreators from '../../redux/modules/ui'

import { formatDate, formatBytes } from '../../util/helpers'

class StorageItemProperties extends Component {
  constructor(props) {
    super(props)

    this.notificationTimeout = null
  }

  copyToClipboard(text) {
    const textArea = document.createElement('textarea')
    textArea.style.left = '-1000px'
    textArea.style.position = 'absolute'
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()

    try {
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      result
        ?
        this.showNotification(<FormattedMessage id="portal.storage.summaryPage.itemProperties.copyToClipboard.successful.label" />)
        :
        this.showNotification(<FormattedMessage id="portal.storage.summaryPage.itemProperties.copyToClipboard.failed.label" />)
    } catch (e) {
      document.body.removeChild(textArea)
      this.showNotification(<FormattedMessage id="portal.storage.summaryPage.itemProperties.copyToClipboard.failed.label" />)
    }

  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeSidePanelNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeSidePanelNotification, 10000)
  }

  render() {
    const {
      copyToClipboard,
      created,
      dateFormat,
      isDirectory,
      lastModified,
      location,
      size,
      urls
    } = this.props

    return (
     <div className='storage-item-properties-container'>
       <div className='storage-item-properties-column left'>
         <div className='info'>
           <FormattedMessage id='portal.storage.summaryPage.itemProperties.created.label' />
           <div className='text'>{formatDate(created, dateFormat)}</div>
         </div>
         <div className='info'>
           <FormattedMessage id='portal.storage.summaryPage.itemProperties.lastModified.label' />
           <div className='text'>{formatDate(lastModified, dateFormat)}</div>
         </div>
         <div className='info'>
           {isDirectory
             ?
               <FormattedMessage id='portal.storage.summaryPage.itemProperties.location.folder.label' />
             :
               <FormattedMessage id='portal.storage.summaryPage.itemProperties.location.file.label' />
           }
           <div className='text'>{location}</div>
         </div>
       </div>
       {!isDirectory &&
         <div className='storage-item-properties-column'>
           <div className='info'>
             <FormattedMessage id='portal.storage.summaryPage.itemProperties.size.label' />
             <div className='text'>{formatBytes(size)}</div>
           </div>
           <div className='info'>
             <FormattedMessage id='portal.storage.summaryPage.itemProperties.url.label' />
             {urls.map((url, index) => (
                 <div key={index} className='url'>
                   <div className='url-text'>
                     {url}
                   </div>
                   <Button
                     className='url-copy-button'
                     bsStyle="link"
                     onClick={() => copyToClipboard(url)}>
                     <FormattedMessage id="portal.storage.summaryPage.itemProperties.copyLink.label" />
                   </Button>
                 </div>
               ))
             }
           </div>
         </div>
       }
     </div>
    )
  }
}

StorageItemProperties.displayName = "StorageItemProperties"
StorageItemProperties.propTypes = {
  copyToClipboard: PropTypes.func,
  created: PropTypes.number,
  dateFormat: PropTypes.string,
  isDirectory: PropTypes.bool,
  lastModified: PropTypes.number,
  location: PropTypes.string,
  size: PropTypes.number,
  uiActions: PropTypes.objext,
  urls: PropTypes.array
}

/* istanbul ignore next */
const mapStateToProps = () => (
  {
    urls: [
      "http://pub_name1/path3/path6",
      "http://pub_name1/path4"
    ]
  }
)

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => (
  {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(StorageItemProperties)
