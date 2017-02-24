import {createAction, handleActions} from 'redux-actions'
import { fromJS } from 'immutable'

import { getAnalysisErrorCodes } from '../../util/status-codes'
import { AVAILABLE_THEMES } from '../../constants/themes'

const UI_LOGIN_URL_SET = 'UI_LOGIN_URL_SET'
const UI_THEME_CHANGED = 'UI_THEME_CHANGED'
const UI_CHART_VIEW_TOGGLED = 'UI_CHART_VIEW_TOGGLED'
const UI_CHANGE_NOTIFICATION = 'UI_CHANGE_NOTIFICATION'
const UI_CHANGE_ASPERA_NOTIFICATION = 'UI_CHANGE_ASPERA_NOTIFICATION'
const UI_ANALYSIS_SERVICE_TYPE_TOGGLED = 'UI_ANALYSIS_SERVICE_TYPE_TOGGLED'
const UI_ANALYSIS_STATUS_CODE_TOGGLED = 'UI_ANALYSIS_STATUS_CODE_TOGGLED'
const UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED = 'UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED'
const UI_ANALYSIS_SP_CHART_CHANGED = 'UI_ANALYSIS_SP_CHART_CHANGED'
const UI_CONTENT_ITEM_SORTED = 'UI_CONTENT_ITEM_SORTED'
const UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED = 'UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED'
const UI_NETWORK_MODAL_TOGGLED = 'UI_NETWORK_MODAL_TOGGLED'

const UI_SHOW_ERROR_DIALOG = 'UI_SHOW_ERROR_DIALOG'
const UI_HIDE_ERROR_DIALOG = 'UI_HIDE_ERROR_DIALOG'
const UI_SHOW_INFO_DIALOG = 'UI_SHOW_INFO_DIALOG'
const UI_HIDE_INFO_DIALOG = 'UI_HIDE_INFO_DIALOG'

const UI_POLICY_ACTIVE_MATCH_CHANGED = 'UI_POLICY_ACTIVE_MATCH_CHANGED'
const UI_POLICY_ACTIVE_SET_CHANGED = 'UI_POLICY_ACTIVE_SET_CHANGED'
const UI_POLICY_ACTIVE_RULE_CHANGED = 'UI_POLICY_ACTIVE_RULE_CHANGED'

const theme = AVAILABLE_THEMES.includes(localStorage.getItem('EricssonUDNUiTheme')) ?
  localStorage.getItem('EricssonUDNUiTheme') : AVAILABLE_THEMES[0]

localStorage.setItem('EricssonUDNUiTheme', theme)

export const docBody = document.body

/* We are manipulating body class with JS, which is not exactly how React
   is usually handling things, but in this case it seems to be the most
   clean and usable way to handle theme changing for this app */

docBody.className += theme + '-theme'

export const defaultUI = fromJS({
  accountManagementModal: null,
  asperaNotification: '',
  networkModal: null,
  contentItemSortDirection: -1,
  contentItemSortValuePath: ['metrics', 'totalTraffic'],
  theme: theme,
  viewingChart: true,
  notification: '',
  analysisOnOffNetChartType: 'bar',
  analysisServiceTypes: ['http', 'https'],
  analysisErrorStatusCodes: getAnalysisErrorCodes(),
  analysisSPChartType: 'bar',
  showErrorDialog: false,
  showInfoDialog: false,
  infoDialogOptions: null,
  loginUrl: null,
  policyActiveMatch: null,
  policyActiveRule: null,
  policyActiveSet: null
})

//SELECTORS
export const getTheme = (state) => {
  return state.ui.get('theme')
}

// REDUCERS

export function accountManagementModalToggled(state, action) {
  return state.merge({ accountManagementModal: action.payload })
}

export function networkModalToggled(state, action) {
  return state.merge({ networkModal: action.payload })
}

export function themeChanged(state, action) {
  docBody.className = docBody.className.replace(
    /dark-theme|light-theme/gi, action.payload + '-theme'
  )
  localStorage.setItem('EricssonUDNUiTheme', action.payload)
  return state.set('theme', action.payload)
}

export function chartViewToggled(state) {
  return state.set('viewingChart', !state.get('viewingChart'))
}

export function notificationChanged(state, action) {
  return state.set('notification', action.payload)
}

export function asperaNotificationChanged(state, action) {
  return state.set('asperaNotification', action.payload)
}

export function analysisServiceTypeToggled(state, action) {
  let newServiceTypes = state.get('analysisServiceTypes')
  if(newServiceTypes.includes(action.payload)) {
    newServiceTypes = newServiceTypes.filter(type => type !== action.payload)
  }
  else {
    newServiceTypes = newServiceTypes.push(action.payload)
  }
  return state.set('analysisServiceTypes', newServiceTypes)
}

export function analysisOnOffNetChartChanged(state, action) {
  return state.set('analysisOnOffNetChartType', action.payload)
}

export function analysisSPChartChanged(state, action) {
  return state.set('analysisSPChartType', action.payload)
}

export function contentItemSorted(state, action) {
  return state.merge({
    contentItemSortDirection: action.payload.direction,
    contentItemSortValuePath: action.payload.valuePath
  })
}

export function loginUrlSet(state, action) {
  return state.set('loginUrl', action.payload)
}

export function errorDialogShown(state) {
  return state.set('showErrorDialog', true);
}

export function errorDialogHidden(state) {
  return state.set('showErrorDialog', false);
}

export function infoDialogShown(state, actions) {
  return state.merge({
    showInfoDialog: true,
    infoDialogOptions: fromJS(actions.payload)
  })
}

export function infoDialogHidden(state) {
  return state.set('showInfoDialog', false);
}

export function analysisStatusCodeToggled(state, action) {
  if(action.payload === getAnalysisErrorCodes()) {
    return state.get('analysisErrorStatusCodes').size === getAnalysisErrorCodes().length ?
      state.set('analysisErrorStatusCodes', fromJS([])) :
      state.set('analysisErrorStatusCodes', fromJS(getAnalysisErrorCodes()))
  }
  let newStatusCodes = state.get('analysisErrorStatusCodes')
  newStatusCodes = newStatusCodes.includes(action.payload) ?
    newStatusCodes.filter(code => code !== action.payload) :
    newStatusCodes.push(action.payload)
  return state.set('analysisErrorStatusCodes', newStatusCodes)
}

export function policyActiveMatchChanged(state, action) {
  return state.merge({
    policyActiveMatch: fromJS(action.payload),
    policyActiveSet: null
  })
}

export function policyActiveSetChanged(state, action) {
  return state.merge({
    policyActiveSet: fromJS(action.payload),
    policyActiveMatch: null
  })
}

export function policyActiveRuleChanged(state, action) {
  return state.merge({
    policyActiveRule: fromJS(action.payload),
    policyActiveSet: null,
    policyActiveMatch: null
  })
}

export default handleActions({
  UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED: accountManagementModalToggled,
  UI_NETWORK_MODAL_TOGGLED: networkModalToggled,
  UI_THEME_CHANGED: themeChanged,
  UI_CHART_VIEW_TOGGLED: chartViewToggled,
  UI_CHANGE_NOTIFICATION: notificationChanged,
  UI_CHANGE_ASPERA_NOTIFICATION: asperaNotificationChanged,
  UI_ANALYSIS_SERVICE_TYPE_TOGGLED: analysisServiceTypeToggled,
  UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED: analysisOnOffNetChartChanged,
  UI_ANALYSIS_SP_CHART_CHANGED: analysisSPChartChanged,
  UI_CONTENT_ITEM_SORTED: contentItemSorted,
  UI_LOGIN_URL_SET: loginUrlSet,
  UI_SHOW_ERROR_DIALOG: errorDialogShown,
  UI_HIDE_ERROR_DIALOG: errorDialogHidden,
  UI_SHOW_INFO_DIALOG: infoDialogShown,
  UI_HIDE_INFO_DIALOG: infoDialogHidden,
  UI_ANALYSIS_STATUS_CODE_TOGGLED: analysisStatusCodeToggled,
  UI_POLICY_ACTIVE_MATCH_CHANGED: policyActiveMatchChanged,
  UI_POLICY_ACTIVE_SET_CHANGED: policyActiveSetChanged,
  UI_POLICY_ACTIVE_RULE_CHANGED: policyActiveRuleChanged
}, defaultUI)

// ACTIONS

export const setLoginUrl = createAction(UI_LOGIN_URL_SET)
export const changeTheme = createAction(UI_THEME_CHANGED)
export const toggleChartView = createAction(UI_CHART_VIEW_TOGGLED)
export const changeNotification = createAction(UI_CHANGE_NOTIFICATION)
export const changeAsperaNotification = createAction(UI_CHANGE_ASPERA_NOTIFICATION)
export const toggleAccountManagementModal = createAction(UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED)
export const toggleNetworkModal = createAction(UI_NETWORK_MODAL_TOGGLED)
export const toggleAnalysisStatusCode = createAction(UI_ANALYSIS_STATUS_CODE_TOGGLED)
export const toggleAnalysisServiceType = createAction(UI_ANALYSIS_SERVICE_TYPE_TOGGLED)
export const changeOnOffNetChartType = createAction(UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED)
export const changeSPChartType = createAction(UI_ANALYSIS_SP_CHART_CHANGED)
export const sortContentItems = createAction(UI_CONTENT_ITEM_SORTED)
export const showErrorDialog = createAction(UI_SHOW_ERROR_DIALOG)
export const hideErrorDialog = createAction(UI_HIDE_ERROR_DIALOG)
export const showInfoDialog = createAction(UI_SHOW_INFO_DIALOG)
export const hideInfoDialog = createAction(UI_HIDE_INFO_DIALOG)
export const changePolicyActiveMatch = createAction(UI_POLICY_ACTIVE_MATCH_CHANGED)
export const changePolicyActiveSet = createAction(UI_POLICY_ACTIVE_SET_CHANGED)
export const changePolicyActiveRule = createAction(UI_POLICY_ACTIVE_RULE_CHANGED)
