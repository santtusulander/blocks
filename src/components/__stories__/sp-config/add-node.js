import React from 'react'
import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux'

import {storiesOf, action} from '@kadira/storybook'

import ThemeWrap from '../theme-wrap.jsx'
import AddNode from '../../sp-config/add-node/add-node.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store = createStore(reducer);

let showModal = true;

storiesOf('SPConfig', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
          {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('AddNode', () => (
    <AddNode show={showModal} onSave={action('onSave')} onCancel={action('onCancel')}/>
  ));
