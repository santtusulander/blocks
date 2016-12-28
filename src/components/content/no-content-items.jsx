import React from 'react'
import { FormattedMessage } from 'react-intl'

function NoContentItems({ content }) {
  return (
    <p className="fetching-info text-center">
      {content}
      <br/>
      <FormattedMessage id="portal.content.createNewProperties"/>
    </p>
  )
}

NoContentItems.displayName = "NoContentItems"
NoContentItems.propTypes = {
  content: React.PropTypes.string
}

export default NoContentItems
