import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../theme-wrap'
import StorageFormContainer from '../../../containers/storage/modals/storage-modal'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

storiesOf('Storage', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('StorageForm (Add)', () => (
    <StorageFormContainer
      show={true}
      editing={false}
      fetching={false}
      onCancel={action('Handling cancel')}
      onSubmit={action('Handling submit')}
    />
  ))
  .add('StorageForm (Edit)', () => (
    <StorageFormContainer
      show={true}
      editing={false}
      fetching={false}
      storageId={'1'}
      onCancel={action('Handling cancel')}
      onSubmit={action('Handling submit')}
    />
  ))
