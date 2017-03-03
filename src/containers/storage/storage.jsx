import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import Content from '../../components/layout/content'
import StorageHeader from '../../components/storage/storage-header'

const Storage = ({ params, currentUser }) => {
  return (
    <Content>
      <StorageHeader
        currentUser={currentUser}
        params={params}
      />
    </Content>
  )
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  currentUser: React.PropTypes.instanceOf(Map),
  params: PropTypes.object
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.get('currentUser')
  }
}

export default connect(mapStateToProps, null)(Storage)
