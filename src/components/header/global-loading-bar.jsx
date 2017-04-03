import React, { PropTypes } from 'react'

class GlobalLoadingBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      animating: props.fetching || false
    }

    this.resetGradientAnimation = this.resetGradientAnimation.bind(this)
  }

  componentDidMount() {
    this.gradient.addEventListener('webkitAnimationEnd', this.resetGradientAnimation)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching) {
      this.setState({ animating: true })
    }
  }

  componentWillUnmount() {
    this.gradient.removeEventListener('webkitAnimationEnd', this.resetGradientAnimation)
  }

  resetGradientAnimation() {
    const gradient = this.gradient
    gradient.classList.remove('animated')

    if (this.props.fetching) {
      gradient.offsetWidth // trigger reflow to restart animation
      gradient.classList.add('animated')
    } else {
      this.setState({ animating: false })
    }
  }

  render() {
    const { animating } = this.state

    return (
      <div
        ref={ref => {
          this.gradient = ref 
        }}
        className={animating ? 'header__gradient animated' : 'header__gradient'}
      />
    )
  }
}

GlobalLoadingBar.displayName = 'GlobalLoadingBar'
GlobalLoadingBar.propTypes = {
  fetching: PropTypes.bool
}

export default GlobalLoadingBar
