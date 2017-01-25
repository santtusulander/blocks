import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../theme-wrap'
import FootprintFormContainer from '../../../containers/network/modals/footprint-modal'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

const dummyCIDROptions = [
  { id: '1', label: '192.168.1.100/1' },
  { id: '2', label: '192.168.1.100/2' },
  { id: '3', label: '192.168.1.100' },
  { id: '4', label: '192.168.1.101' }
];

const dummyASNOptions = [
  { id: '1', label: 'DummyASN1' },
  { id: '2', label: 'DummyASN2' },
  { id: '3', label: 'DummyASN3' },
  { id: '4', label: 'DummyASN4' }
];

const dummyUDNTypeOptions = [
  { value: '1', label: 'DummyType1' },
  { value: '2', label: 'DummyType2' },
  { value: '3', label: 'DummyType3' },
  { value: '4', label: 'DummyType4' }
];

storiesOf('Network', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('FootprintForm', () => (
    <FootprintFormContainer
      show={true}
      editing={false}
      fetching={false}
      ASNOptions={dummyASNOptions}
      CIDROptions={dummyCIDROptions}
      udnTypeOptions={dummyUDNTypeOptions}
      onCancel={action('Handling cancel')}
      onDelete={action('Handling submit')}
      onSubmit={action('Handling submit')}
    />
  ));
