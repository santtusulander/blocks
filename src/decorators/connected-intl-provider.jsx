import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';

import { getCurrentUser } from '../redux/modules/user'

import MESSAGES_EN from '../locales/en-US'
import MESSAGES_ZH from '../locales/zh-CN'
import MESSAGES_ES from '../locales/es-ES'
import MESSAGES_FR from '../locales/fr-FR'

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';


addLocaleData([...en, ...zh, ...es, ...fr]);
const messages= {
  "en": MESSAGES_EN,
  "zh": MESSAGES_ZH,
  "es": MESSAGES_ES,
  "fr": MESSAGES_FR
}

function mapStateToProps(state) {
  const currentUser = getCurrentUser(state)
  const lang = currentUser.get('locale') ? currentUser.get('locale').split('-')[0] : 'en'
  const locale = currentUser.get('locale') || 'en'

  // Merged "en" messages with selected language messages to set untranslated strings default to english
  const mergedMessages = Object.assign(MESSAGES_EN, messages[lang])

  return {
    locale,
    defaultLocale: 'en-US',
    messages: mergedMessages

  }
}

export default connect(mapStateToProps)(IntlProvider);
