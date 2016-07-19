import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {reducer as form} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import InlineAdd from '../inline-add.jsx'

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
            validate={({ a }) => {
              let errors = {}
              if( a && a.length > 3) {
                errors.a = 'no go'
              }
              return errors
            }}
            fields={['a', 'b']}
            cancel={action('cancel pressed')}
            save={(vals) => console.log(vals)}>
            <input id='a' type="text"/>
            <input id='b' type="text"/>
        </InlineAdd>
      </tbody>
    </table>
  ))
