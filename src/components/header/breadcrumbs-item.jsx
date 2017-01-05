import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

import {
  getAnalyticsUrl,
  getAnalyticsUrlFromParams,
  getContentUrl
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
        url: params.property ? urlMethod('group', params.group, params) : null,
        label:  params.group === activeGroup ? props.activeGroup.get('name') : <FormattedMessage id="portal.header.group.text"/>
      })
    }
  }

  addPropertyLink(props, links, urlMethod, isLastLink) {
    const { params, params: { property } } = props

    if (property) {
      links.push({
        url: !isLastLink ? urlMethod('property', property, params) : null,
        label:  property
      })
    }
  }

  updateLinks(props) {
    let links = []
    const { pathname, params } = props
    const { roles, user, router } = this.props

    if (router.isActive(getRoute('content'))) {
      let propertyLinkIsLast = true
      if (router.isActive(getRoute('analyticsProperty', params))) {
        links.push({
          label:  <FormattedMessage id="portal.header.analytics.text"/>
        })

        propertyLinkIsLast = false
      }

      if (router.isActive(getRoute('contentPropertyConfiguration', params))) {
        links.push({
          label:  <FormattedMessage id="portal.header.configuration.text"/>
        })

        propertyLinkIsLast = false
      }

      this.addPropertyLink(props, links, getContentUrl, propertyLinkIsLast)
      this.addGroupLink(props, links, getContentUrl)

      links.push({
        label:  <FormattedMessage id="portal.header.content.text"/>,
        url: params.account && links.length > 0 ? getContentUrl('groups', params.account, params) : null
      })
    } else if (router.isActive(getRoute('analytics'))) {
      this.addPropertyLink(props, links, getAnalyticsUrl)
      this.addGroupLink(props, links, getAnalyticsUrl)

      const accountParams = { 'brand': params.brand, 'account': params.account }
      links.push({
        label: <FormattedMessage id="portal.header.analytics.text"/>,
        url: links.length > 0 ? getAnalyticsUrlFromParams(accountParams, user, roles) : null
      })
    } else if (new RegExp( getRoute('accountManagement'), 'g' ).test(pathname)) {
      links.push( {label:  'Account Management'} )
    } else if (new RegExp( getRoute('services'), 'g' ).test(pathname)) {
      links.push( {label:  'Services'} )
    } else if (new RegExp( getRoute('security'), 'g' ).test(pathname)) {
      links.push( {label:  'Security'} )
    } else if (new RegExp( getRoute('support'), 'g' ).test(pathname)) {
      links.push( {label:  'Support'} )
    } else if (new RegExp( getRoute('configuration'), 'g' ).test(pathname)) {
      links.push( {label:  'Configuration'} )
    } else if (new RegExp( getRoute('network'), 'g' ).test(pathname)) {
      links.push( {label:  'Network'} )
    } else if (new RegExp( getRoute('dashboard'), 'g' ).test(pathname)) {
      links.push( {label:  'Dashboard'} )
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
  roles: PropTypes.instanceOf(Immutable.List),
  router: PropTypes.object,
  user: PropTypes.instanceOf(Immutable.Map)
}

export default BreadcrumbsItem
