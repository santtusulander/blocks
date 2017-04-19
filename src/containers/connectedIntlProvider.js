import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';


import TRANSLATED_MESSAGES from '../locales/en/'
import TRANSLATED_MESSAGES_ZH from '../locales/zh/'

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';


addLocaleData([...en, ...zh]);

const messages= {
  "en": TRANSLATED_MESSAGES,
  "zh": TRANSLATED_MESSAGES_ZH
}

function mapStateToProps(state) {
  const currentUser = state.user.get('currentUser')
  const locale = currentUser.get('locale') ? currentUser.get('locale').split('-')[0] : 'en'

  return {
    locale: locale,
    messages: messages[locale]
  }
}

export default connect(mapStateToProps)(IntlProvider);
