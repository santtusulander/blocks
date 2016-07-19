import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {reducer as form} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import InlineAdd from '../inline-edit.jsx'

const stateReducer = combineReducers({ form })
const store = createStore(stateReducer)
const ThemeWrap = require('./theme-wrap.jsx')

storiesOf('Inline Add', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider {...{ store }}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
    <table>
      <tbody>
        <InlineAdd
            validate={({a, b}) => {
              console.log(a)
              console.log(b)
            }}
            fields={['a', 'b']}
            cancel={action('cancel pressed')}
            save={action('save pressed')}>
            <input id='a' type="text"/>
            <input id='b' type="text"/>
        </InlineAdd>
      </tbody>
    </table>
  ))
