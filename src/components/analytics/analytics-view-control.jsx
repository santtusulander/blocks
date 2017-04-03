import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { withRouter } from 'react-router'
import { ButtonToolbar } from 'react-bootstrap'
import { injectIntl } from 'react-intl'

import * as PERMISSIONS from '../../constants/permissions'

import PageHeader from '../layout/page-header'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'
import { getTabName } from '../../util/helpers.js'
import { getAnalyticsUrl } from '../../util/routes.js'
import TruncatedTitle from '../truncated-title'
import AnalyticsExport from '../../containers/analytics/export.jsx'
import IconCaretDown from '../icons/icon-caret-down'

const AnalyticsViewControl = (props) => {

  const {
    account,
    group,
    property,
    storage
  } = props.params

  const tabs = [
    {
      key: 'traffic',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.traffic.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.traffic.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.traffic.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.traffic.accountTitle'})
      }
    },
    {
      key: 'cache-hit-rate',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.cacheHitRate.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.cacheHitRate.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.cacheHitRate.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.cacheHitRate.accountTitle'})
      }
    },
    {
      key: 'visitors',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.visitors.label'}),
      permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.visitors.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.visitors.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.visitors.accountTitle'})
      }
    },
    {
      key: 'on-off-net',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.onOffNet.label'}),
      hideHierarchy: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.onOffNet.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.onOffNet.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.onOffNet.accountTitle'})
      }
    },
    {
      key: 'contribution',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.contribution.label'}),
      hideHierarchy: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.serviceProviders.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.serviceProviders.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.serviceProviders.accountTitle'})
      }
    },
    {
      key: 'storage-overview',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.storage.storageTitle'}),
      hideForProperty: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_STORAGE,
      titles: {
        storage: props.intl.formatMessage({id: 'portal.analytics.tabs.storage.storageTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.storage.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.storage.accountTitle'})
      }
    },
    {
      key: 'file-error',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.fileError.label'}),
      propertyOnly: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.fileError.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.fileError.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.fileError.accountTitle'})
      }
    },
    {
      key: 'url-report',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.urlReport.label'}),
      propertyOnly: true,
      permission: PERMISSIONS.VIEW_ANALYTICS_URL,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.urlReport.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.urlReport.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.urlReport.accountTitle'})
      }
    },
    {
      key: 'playback-demo',
      label: props.intl.formatMessage({id: 'portal.analytics.tabs.playbackDemo.label'}),
      hideHierarchy: true,
      titles: {
        property: props.intl.formatMessage({id: 'portal.analytics.tabs.playbackDemo.propertyTitle'}),
        group: props.intl.formatMessage({id: 'portal.analytics.tabs.playbackDemo.groupTitle'}),
        account: props.intl.formatMessage({id: 'portal.analytics.tabs.playbackDemo.accountTitle'})
      }
    }
  ]

  let title = "Analytics"
  let active
  if (props.activeTab) {
    active = tabs.find(tab => tab.key === props.activeTab)
    if (active) {
      if (active.hideHierarchy) {
        title = active.label
      }  else if (storage) {
        title = active.titles.storage
      }  else if (property) {
        title = active.titles.property
      }  else if (group) {
        title = active.titles.group
      }  else {
        title = active.titles.account
      }
    }
  }

  let activeItem;
  if (property) {
    activeItem = property
  }  else if (group && props.activeGroup) {
    activeItem = props.activeGroup.get('name')
  }  else if (account && props.activeAccount) {
    activeItem = props.activeAccount.get('name')
  }
  const topBarTexts = {
    property: 'Back to Groups',
    group: 'Back to Accounts',
    account: 'UDN Admin',
    brand: 'UDN Admin'
  }
  const topBarFunc = (tier, fetchItems, IDs) => {
    const { account, brand } = IDs
    switch (tier) {
      case 'property':
        fetchItems('group', brand, account)
        break
      case 'group':
        fetchItems('account', brand)
        break
      case 'brand':
      case 'account':
        props.router.push(getAnalyticsUrl('brand', 'udn', {}))
        break
    }
  }

  return (
    <PageHeader pageSubTitle={title}>
    {/* Hide the dropdown until we get the storage included in it */}
      {!props.params.storage ?
        <AccountSelector
          as="analytics"
          params={props.params}
          topBarTexts={topBarTexts}
          topBarAction={topBarFunc}
          onSelect={(...params) => {
            let url = getAnalyticsUrl(...params)
            if (active) {
              let tab = active.key
              if ((active.propertyOnly && params[0] !== 'property') ||
              (active.hideForProperty && params[0] === 'property')) {
                tab = ''
              }
              url = `${url}/${tab}`
            }
            props.router.push(url)
          }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1><TruncatedTitle content={activeItem || props.intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})} tooltipPlacement="bottom" className="account-management-title"/></h1>
          <IconCaretDown />
        </div>
      </AccountSelector> :
      <h1><TruncatedTitle content={props.params.storage} /></h1>
    }
      {props.params.account &&
        <ButtonToolbar>
          <AnalyticsExport
            activeTab={getTabName(props.location.pathname)}
            params={props.params}
            />
        </ButtonToolbar>
      }
    </PageHeader>
  )
}

AnalyticsViewControl.displayName = "AnalyticsViewControl"

AnalyticsViewControl.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeTab: PropTypes.string,
  intl: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  router: React.PropTypes.object
}

AnalyticsViewControl.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  params: {}
}

export default withRouter(injectIntl(AnalyticsViewControl))
