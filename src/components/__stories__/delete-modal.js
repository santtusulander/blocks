import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import { reducer as form } from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {FormattedMessage} from 'intl'

import ModalWindow from '../shared/modal.jsx'
import ThemeWrap from './theme-wrap.jsx'

const reducer = combineReducers({ form });
const store = createStore(reducer);
storiesOf('Delete Modal', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
      {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
    <ModalWindow
      title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: 'Certificate'}}/>}
      deleteButton={action('delete pressed')}
      cancelButton={action('delete pressed')}/>
  ))
