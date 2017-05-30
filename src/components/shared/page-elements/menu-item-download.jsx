import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { MenuItem } from 'react-bootstrap'

import publishedUrlActions from '../../../redux/modules/entities/published-urls/actions'
import { getById as getPublishedURLsById } from '../../../redux/modules/entities/published-urls/selectors'
import { buildReduxId } from '../../../redux/util'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'


class MenuItemDownload extends Component {
  componentDidMount() {
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
  render() {
    const {label, downloadUrl, isFetchingUrls} = this.props
    return (
      <MenuItem
        href={downloadUrl}
        disabled={isFetchingUrls}
        target='_blank'
        download={true}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        {label}
        {isFetchingUrls && <LoadingSpinnerSmall/>}
      </MenuItem>
    )

  }
}

MenuItemDownload.displayName = "MenuItemDownload"
MenuItemDownload.propTypes = {
  createUrls: PropTypes.func,
  downloadUrl: PropTypes.string,
  isFetchingUrls: PropTypes.bool,
  label: React.PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node ]).isRequired,
  name: PropTypes.string,
  params: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const { params: { brand, account, group, storage, splat }, name } = ownProps
  const publishedUrlsId = buildReduxId(brand, account, group, storage, `${splat ? `/${splat}/` : '/'}${name}`)
  const publishedUrls = getPublishedURLsById(state, publishedUrlsId)
  return {
    downloadUrl: publishedUrls ? publishedUrls.getIn(['downloadUrls', 1]) : '',
    isFetchingUrls: getFetchingByTag(state, 'publishedUrls')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => (
  {
    createUrls: (params) => dispatch(publishedUrlActions.create(params))
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDownload)
