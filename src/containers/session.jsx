import React, {Component} from 'react'
import {connect} from 'react-redux'

import {checkToken, startFetching, finishFetching} from '../redux/modules/user'

class Session extends Component {
  componentWillMount(){
    this.props.startFetch()
    this.props.checkUserToken()
      .then( () => this.props.stopFetch())
  }

  render(){
    return (
      <div>
        {this.props.children && this.props.children}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startFetch: () => dispatch( startFetching()),
    stopFetch: () => dispatch( finishFetching()),
    checkUserToken: () => dispatch(checkToken())
  }
}

export default connect(null, mapDispatchToProps)(Session);
