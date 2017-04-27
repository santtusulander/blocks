import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

import {
  getAnalyticsUrl,
  getAnalyticsUrlFromParams,
  getNetworkUrl,
  getContentUrl,
  getAccountManagementUrlFromParams,
  getSecurityUrl,
  getSecurityUrlFromParams
} from '../../util/routes.js'
import { getRoute } from '../../util/routes'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx'

class BreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = { links: [] }

    this.addGroupLink = this.addGroupLink.bind(this)
    this.addPropertyLink = this.addPropertyLink.bind(this)
    this.updateLinks = this.updateLinks.bind(this)
  }

  componentDidMount() {
    this.updateLinks(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
        this.props.pathname !== nextProps.pathname
        || JSON.stringify(this.props.params) !== JSON.stringify(nextProps.params)
        || !Immutable.is(this.props.activeGroup, nextProps.activeGroup)
    ) {
      this.updateLinks(nextProps)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!Immutable.is(Immutable.List(this.state.links), Immutable.List(nextState.links))) {
      return true
    }

    return false
  }

  addGroupLink(props, links, urlMethod) {
    const activeGroup = props.activeGroup && props.activeGroup.size ?
      props.activeGroup.get('id').toString() : null,
      params = props.params;

    if (params.group === activeGroup) {
      links.push({
        url: (params.property || params.storage) ? urlMethod('group', params.group, params) : null,
        label: params.group === activeGroup ? props.activeGroup.get('name') : <FormattedMessage id="portal.header.group.text"/>
      })
    }
  }

  addPropertyLink(props, links, urlMethod, isLastLink) {
    const { params, params: { property } } = props

    if (property) {
      links.push({
        url: !isLastLink ? urlMethod('property', property, params) : null,
        label: property
      })
    }
  }

  addStorageLink(props, links, urlMethod, isLastLink) {
    const { params, params: { storage } } = props

    if (storage) {
      links.push({
        url: !isLastLink ? urlMethod('storage', storage, params) : null,
        label: storage
      })
    }
  }

  updateLinks(props) {
    const links = []
    const { pathname, params, activeGroup } = props
    const { roles, user, router } = this.props

    if (router.isActive(getRoute('content'))) {
      let propertyLinkIsLast = true
      let storageLinkIsLast = true
      if (router.isActive(getRoute('analyticsProperty', params))) {
        links.push({
          label: <FormattedMessage id="portal.header.analytics.text"/>
        })

        propertyLinkIsLast = false
      }

      if (router.isActive(getRoute('contentPropertyConfiguration', params))) {
        links.push({
          label: <FormattedMessage id="portal.header.configuration.text"/>
        })

        propertyLinkIsLast = false
      }

      if (router.isActive(getRoute('analyticsStorage', params))) {
        links.push({
          label: <FormattedMessage id="portal.header.analytics.text"/>
        })

        storageLinkIsLast = false
      }

      if (router.isActive(getRoute('contentStorageConfiguration', params))) {
        links.push({
          label: <FormattedMessage id="portal.header.configuration.text"/>
        })

        storageLinkIsLast = false
      }

      this.addPropertyLink(props, links, getContentUrl, propertyLinkIsLast)
      this.addStorageLink(props, links, getContentUrl, storageLinkIsLast)
      this.addGroupLink(props, links, getContentUrl)

      links.push({
        label: <FormattedMessage id="portal.header.content.text"/>,
        url: params.account && links.length > 0 ? getContentUrl('groups', params.account, params) : null
      })
    } else if (router.isActive(getRoute('analytics'))) {
      this.addPropertyLink(props, links, getAnalyticsUrl)
      this.addStorageLink(props, links, getAnalyticsUrl)
      this.addGroupLink(props, links, getAnalyticsUrl)

      const accountParams = { 'brand': params.brand, 'account': params.account }
      links.push({
        label: <FormattedMessage id="portal.header.analytics.text"/>,
        url: links.length > 0 ? getAnalyticsUrlFromParams(accountParams, user) : null
      })
    } else if (new RegExp(getRoute('accountManagement'), 'g').test(pathname)) {
      /*
        Show group in breadcrumb in properties & storage tabs.
      */
      const baseAccUrl = getAccountManagementUrlFromParams(params)
      if (router.isActive(`${baseAccUrl}/properties`) ||
          router.isActive(`${baseAccUrl}/storage`)) {
        this.addGroupLink(props, links, getContentUrl)
      }

      links.push({
        label: <FormattedMessage id="portal.account.manage.accountManagement.title"/>,
        url: links.length > 0 ? getAccountManagementUrlFromParams({ brand: params.brand, account: params.account }) : null
      })

    } else if (new RegExp(getRoute('services'), 'g').test(pathname)) {
      links.push({label: <FormattedMessage id="portal.header.services.text"/>})
    } else if (new RegExp(getRoute('security'), 'g').test(pathname)) {
      this.addGroupLink(props, links, getSecurityUrl)

      links.push({
        label: <FormattedMessage id="portal.header.security.text" />,
        url: links.length > 0 ? getSecurityUrlFromParams({ brand: params.brand, account: params.account }) : null
      })
    } else if (new RegExp(getRoute('support'), 'g').test(pathname)) {
      links.push({label: <FormattedMessage id="portal.header.support.text"/>})
    } else if (new RegExp(getRoute('configuration'), 'g').test(pathname)) {
      links.push({label: <FormattedMessage id="portal.header.configuration.text"/>})
    } else if (new RegExp(getRoute('network'), 'g').test(pathname)) {
      // Link to POD
      if (params.pod) {
        links.push({
          label: params.pod,
          url: getNetworkUrl('pod', params.pod, params)
        })
      }

      // Link to POP
      if (params.pop) {
        links.push({
          label: params.pop,
          url: getNetworkUrl('pop', params.pop, params)
        })
      }

      // Link to Network
      if (params.network) {
        links.push({
          label: params.network,
          url: getNetworkUrl('network', params.network, params)
        })
      }

      // Link to Group
      // eslint-disable-next-line eqeqeq
      if (params.group && (activeGroup && (activeGroup.get('id') == params.group))) {
        links.push({
          label: activeGroup.get('name'),
          url: getNetworkUrl('group', params.group, params)
        })
      }

      // Label with the page name
      links.push({
        label: <FormattedMessage id="portal.network.network.title"/>,
        url: params.group && getNetworkUrl('account', params.account, params)
      })

    } else if (new RegExp(getRoute('dashboard'), 'g').test(pathname)) {
      links.push({label: <FormattedMessage id="portal.header.dashboard.text"/>})
    }

    this.setState({ links: links.reverse() })
  }

  render() {
    const { links } = this.state

    return (
      <li className="header__breadcrumb">
        <Breadcrumbs links={links} />
      </li>
    )
  }

}

BreadcrumbsItem.displayName = 'BreadcrumbsItem'
BreadcrumbsItem.propTypes = {
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  params: PropTypes.object,
  pathname: PropTypes.string,
  roles: PropTypes.instanceOf(Immutable.Map),
  router: PropTypes.object,
  user: PropTypes.instanceOf(Immutable.Map)
}

export default BreadcrumbsItem
