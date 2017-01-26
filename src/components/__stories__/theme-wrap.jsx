import React from 'react'
import { IntlProvider } from 'react-intl'

import TRANSLATED_MESSAGES from '../../locales/en'

class ThemeWrap extends React.Component {
  constructor(props) {
    super(props);

    if (props.theme) {
      this.state = { theme: props.theme };
    } else {
      this.state = { theme: 'dark' };
    }

    this.toggleTheme = this.toggleTheme.bind(this);
  }

  componentDidMount() {
    this.setBodyClass(this.state.theme);
  }

  toggleTheme() {

    const theme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setBodyClass(theme);
    this.setState({ 'theme': theme });

  }

  setBodyClass(theme) {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');

    document.body.classList.add(theme + '-theme');
  }

  render() {
    return (
      <IntlProvider locale="en" messages={TRANSLATED_MESSAGES}>
        <div>
          <h5>Using: {this.state.theme} -theme <a onClick={this.toggleTheme}>Switch theme</a></h5>
          <hr/>
          {this.props.children}
        </div>
      </IntlProvider>
    );
  }

}

ThemeWrap.displayName = 'ThemeWrap'
ThemeWrap.propTypes = {
  children: React.PropTypes.node,
  theme: React.PropTypes.string
};

export default ThemeWrap
