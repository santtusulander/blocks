import React from 'react'

class ThemeWrap extends React.Component {
  constructor(props){
    super(props);

    this.state = {theme: props.theme};
  }

  componentDidMount(){
    this.setBodyClass(this.state.theme);
  }

  toggleTheme(){

    if( this.state === 'dark') this.setState({theme: 'light'});
    else this.setState({theme: 'dark'});

    this.setBodyClass( theme );

  }

  setBodyClass( theme ){
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');

    document.body.classList.add(this.state.theme + '-theme');
  }

  render() {
    return(
      <div className={this.state.theme + '-theme'}>
        <h3><a href="" onClick={() => { this.toggleTheme();}  }>Switch theme</a></h3>
        <h5>{this.state.theme}</h5>
          {this.props.children}
      </div>
    );
  }

}

ThemeWrap.displayName = 'ThemeWrap'
ThemeWrap.propTypes = {
  children: React.PropTypes.node,
  theme: React.PropTypes.string
};

module.exports = ThemeWrap
