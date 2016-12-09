import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl';

import { CREATE_ZONE, MODIFY_ZONE } from '../../constants/permissions'

import PageHeader from '../layout/page-header'
import TruncatedTitle from '../truncated-title'
import IsAllowed from '../is-allowed'
import DomainSelector from '../global-account-selector/selector-component'
import IconAdd from '../icons/icon-add'
import IconEdit from '../icons/icon-edit'
import IconCaretDown from '../icons/icon-caret-down'

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain, searchFunc, searchValue, emptyDomainsTxt }) => {
  const sortedDomains = domains.sort((a,b) => {
    if (a.id.toLowerCase() < b.id.toLowerCase()) return -1
    if (a.id.toLowerCase() > b.id.toLowerCase()) return 1
    return 0
  })
  return (
    <PageHeader secondaryPageHeader={true} distributedColumns={true}>
      {domains.length > 0 || searchValue !== '' ?
        <DomainSelector
          id="domain-selector"
          items={sortedDomains.map(domain => [domain.id, domain.id])}
          onItemClick={changeActiveDomain}
          searchValue={searchValue}
          onSearch={searchFunc}>
            <div className="dropdown-toggle header-toggle">
              <h4><TruncatedTitle content={activeDomain} tooltipPlacement="bottom"/></h4><IconCaretDown />
            </div>
        </DomainSelector> :
        <h4 id='empty-domains-text' className="selector-component"><FormattedMessage id={emptyDomainsTxt}/></h4>}
      <ButtonToolbar>
        <IsAllowed to={CREATE_ZONE}>
          <Button
            id="add-domain"
            bsStyle="success"
            className="btn-icon"
            onClick={onAddDomain}>
            <IconAdd/>
          </Button>
        </IsAllowed>
        {activeDomain &&
          <IsAllowed to={MODIFY_ZONE}>
            <Button
            id="edit-domain"
            bsStyle="primary"
            className="btn-icon"
            onClick={() => onEditDomain(activeDomain)}>
            <IconEdit/>
          </Button>
        </IsAllowed>}
      </ButtonToolbar>
    </PageHeader>
  )
}

DomainToolbar.displayName = 'DomainToolbar'
DomainToolbar.propTypes = {
  activeDomain: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  domains: PropTypes.array,
  emptyDomainsTxt: PropTypes.string,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}

export default DomainToolbar
