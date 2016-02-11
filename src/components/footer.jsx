import React from 'react'

class Footer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      layoutHasSidebar: false
    }
  }
  componentDidMount() {
    if(document.getElementsByClassName('sidebar-layout').length !== 0) {
      this.setState({
        layoutHasSidebar: true
      })
    }
  }
  render() {
    let className = 'footer'
    if(this.state.layoutHasSidebar) {
      className += ' has-layout-sidebar'
    }
    if(this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <footer className={className}>
        <div className="footer-content">
          <p>v <!-- @echo PACKAGE_VERSION --></p>
        </div>
      </footer>
    );
  }
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  className: React.PropTypes.string
}

module.exports = Footer
