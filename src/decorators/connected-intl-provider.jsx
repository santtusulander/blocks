import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';

import MESSAGES_EN from '../locales/en'
import MESSAGES_ZH from '../locales/zh'
import MESSAGES_ES from '../locales/es'
import MESSAGES_FR from '../locales/fr'

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import es from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/zh';


addLocaleData([...en, ...zh, ...es, ...fr]);
const messages= {
  "en": MESSAGES_EN,
  "zh": MESSAGES_ZH,
  "es": MESSAGES_ES,
  "fr": MESSAGES_FR
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
