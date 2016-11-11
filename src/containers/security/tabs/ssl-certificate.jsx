import React, {Component} from 'react'

import SSLList from '../../../components/security/ssl-list'

class TabSslCertificate extends Component {
  shouldComponentUpdate(){
    return true
  }

  render(){
    return (
      <SSLList {...this.props}/>
    )
  }
}

export default TabSslCertificate
