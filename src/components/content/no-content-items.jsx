import React from 'react'
import { FormattedMessage } from 'react-intl'

const NoContentItems = props => {
  return (
    <p className="fetching-info text-center">
      {props.content}
      <br/>
      <FormattedMessage id="portal.content.createNewProperties"/>
    </p>
  )
}
NoContentItems.propTypes = {
  content: React.PropTypes.string
}

export default NoContentItems
