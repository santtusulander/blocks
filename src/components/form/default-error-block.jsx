import React, { PropTypes } from 'react'
import { HelpBlock } from 'react-bootstrap'

const DefaultErrorBlock = ({ error }) =>
  <HelpBlock className='error-msg'>{error}</HelpBlock>

DefaultErrorBlock.displayName = 'DefaultErrorBlock'
DefaultErrorBlock.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool])
}

export default DefaultErrorBlock
