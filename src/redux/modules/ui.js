import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'

const UI_THEME_CHANGED = 'UI_THEME_CHANGED'
const UI_CHART_VIEW_TOGGLED = 'UI_CHART_VIEW_TOGGLED'

const defaultUI = Immutable.Map({
  theme: 'dark',
  viewingChart: true
})

// REDUCERS

export default handleActions({
  UI_THEME_CHANGED: (state, action) => {
    return state.set('theme', action.payload)
  },
  UI_CHART_VIEW_TOGGLED: (state) => {
    return state.set('viewingChart', !state.get('viewingChart'))
  }
}, defaultUI)

// ACTIONS

export const changeTheme = createAction(UI_THEME_CHANGED)
export const toggleChartView = createAction(UI_CHART_VIEW_TOGGLED)
