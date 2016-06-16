import React from 'react'

class AnalyticsProperty extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("Property: componentDidMount()");
    //TODO: call fetchHost()
  }

  render() {
    return (
      <div>
        <h1>AnalyticsProperty</h1>

        {this.props.children}

      </div>
    )
  }
}

export default AnalyticsProperty
