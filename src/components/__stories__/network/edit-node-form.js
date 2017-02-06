import React from 'react'
import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux'

import {storiesOf, action} from '@kadira/storybook'

import ThemeWrap from '../theme-wrap.jsx'
import NetworkEditNodeFormContainer from '../../../containers/network/modals/edit-node-modal.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers)
const store = createStore(reducer)

const showModal = true

const mockNodes = [
  {
    id: 'abc.def.123.456',
    name: 'First node',
    node_role: 'cache',
    node_env: 'staging',
    node_type: 'udn_core',
    cloud_driver: 'do',
    custom_grains: 'test 1',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-16 05:04:03'
  },
  {
    id: 'def.ghj.789.012',
    name: 'Second node',
    node_role: 'cache',
    node_env: 'production',
    node_type: 'udn_core',
    cloud_driver: 'ec2',
    custom_grains: 'test 2',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-10 05:04:03'
  }
]

storiesOf('Network', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Edit Nodes Form', () => (
    <NetworkEditNodeFormContainer show={showModal} nodes={mockNodes} onSave={action('onSave')} onCancel={action('onCancel')}/>
  ));
