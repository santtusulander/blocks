import React, { PropTypes } from 'react'

const GlobalLoadingBar = ({fetching}) => {
  return (
    <div className={fetching ? 'header__gradient animated' : 'header__gradient'}/>
  )
}

GlobalLoadingBar.displayName = 'GlobalLoadingBar'
GlobalLoadingBar.propTypes = {
  fetching: PropTypes.bool
}

export default GlobalLoadingBar
