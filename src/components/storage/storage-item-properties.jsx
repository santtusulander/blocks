import React, { PropTypes, Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { List } from 'immutable'

import TruncatedTitle from '../shared/page-elements/truncated-title'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm'

import * as uiActionCreators from '../../redux/modules/ui'
import publishedUrlActions from '../../redux/modules/entities/published-urls/actions'
import { getById as getPublishedURLsById } from '../../redux/modules/entities/published-urls/selectors'
import { getFetchingByTag } from '../../redux/modules/fetching/selectors'
import { buildReduxId } from '../../redux/util'
import { formatDate, formatBytes } from '../../util/helpers'

class StorageItemProperties extends Component {
  constructor(props) {
    super(props)

    this.notificationTimeout = null
  }

  componentDidMount() {
    if (!this.props.isDirectory && this.props.urls.size === 0) {
      const { params: { brand, account, group, storage, splat }, name, createUrls } = this.props
      const urlParams = {
        brand,
        account,
        group,
        payload: {
          ingest_points: [
            {
              ingest_point_id: storage,
              ingest_paths: [`${splat ? `/${splat}/` : '/'}${name}`]
            }
          ]
        }
      }
      createUrls(urlParams)
    }
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
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  render() {
    const {
      created,
      dateFormat,
      isDirectory,
      isFetchingUrls,
      lastModified,
      params,
      size,
      urls
    } = this.props

    const location = params.splat
      ?
        `${params.storage}/${params.splat}`
      :
        params.storage

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
          <div className='storage-item-properties-column right'>
            <div className='info'>
              <FormattedMessage id='portal.storage.summaryPage.itemProperties.size.label' />
              <div className='text'>{formatBytes(size)}</div>
            </div>
            <div className='info'>
              <FormattedMessage id='portal.storage.summaryPage.itemProperties.url.label' />
              {isFetchingUrls
                ?
                  <div><LoadingSpinnerSmall /></div>
                :
                  urls.map((url, index) => (
                    <div key={index} className='url'>
                      <div className='url-text'>
                        <TruncatedTitle content={url} />
                      </div>
                      <Button
                        className='url-copy-button'
                        bsStyle="link"
                        onClick={() => this.copyToClipboard(url)}>
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
  createUrls: PropTypes.func,
  created: PropTypes.number,
  dateFormat: PropTypes.string,
  isDirectory: PropTypes.bool,
  isFetchingUrls: PropTypes.bool,
  lastModified: PropTypes.number,
  name: PropTypes.string,
  params: PropTypes.object,
  size: PropTypes.number,
  uiActions: PropTypes.object,
  urls: PropTypes.instanceOf(List)
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const { params: { brand, account, group, storage, splat }, name } = ownProps
  const publishedUrlsId = buildReduxId(brand, account, group, storage, `${splat ? `/${splat}/` : '/'}${name}`)
  const publishedUrls = getPublishedURLsById(state, publishedUrlsId)
  return {
    urls: publishedUrls ? publishedUrls.get('publishedUrls') : List(),
    isFetchingUrls: getFetchingByTag(state, 'publishedUrls')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => (
  {
    createUrls: (params) => dispatch(publishedUrlActions.create(params)),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(StorageItemProperties)
