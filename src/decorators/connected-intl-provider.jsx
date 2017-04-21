import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';

import MESSAGES_EN from '../locales/en/'
import MESSAGES_ZH from '../locales/zh/'

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';


addLocaleData([...en, ...zh]);
const messages= { "en": MESSAGES_EN, "zh": MESSAGES_ZH }

function mapStateToProps(state) {
  const currentUser = state.user.get('currentUser')
  const locale = currentUser.get('locale') ? currentUser.get('locale').split('-')[0] : 'en'

  return {
    locale: locale,
    messages: messages[locale]
  }
}

export default connect(mapStateToProps)(IntlProvider);
