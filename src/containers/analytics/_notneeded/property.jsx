import React from 'react'

class AnalyticsProperty extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("Property: componentDidMount()");
  }

  render() {
    return (
      <div>
        <h2>Analytics for property</h2>
        {this.props.children}
      </div>
    )
  }
}

export default AnalyticsProperty
