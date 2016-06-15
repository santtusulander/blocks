import React from 'react'

class AnalyticsTemplate extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div>
        <h2>Analytics Template</h2>

        {this.props.main}

      </div>
    )
  }
}

export default AnalyticsTemplate
