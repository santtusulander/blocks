import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../theme-wrap'
import FootprintForm from '../../network/forms/footprint-form'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

storiesOf('Network', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('FootprintForm', () => (
    <FootprintForm
      show={true}
      onCancel={action('Handling cancel')}
      onSubmit={action('Handling submit')}
    />
  ));
