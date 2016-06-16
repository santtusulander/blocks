import React from 'react'

class AnalyticsContainer extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div>
        <h2>Analytics Container</h2>

        {this.props.children}

      </div>
    )
  }
}

export default AnalyticsContainer

//TODO: get breadcrumbs from store
//set active brand, account, group, property
