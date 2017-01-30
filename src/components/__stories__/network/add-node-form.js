import React from 'react'
import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux'

import {storiesOf, action} from '@kadira/storybook'

import ThemeWrap from '../theme-wrap.jsx'
import NetworkAddNodeFormContainer from '../../../containers/network/modals/add-node-modal.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store = createStore(reducer);

let showModal = true;

storiesOf('Network', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Add Node Form', () => (
    <NetworkAddNodeFormContainer show={showModal} onSave={action('onSave')} onCancel={action('onCancel')}/>
  ));
