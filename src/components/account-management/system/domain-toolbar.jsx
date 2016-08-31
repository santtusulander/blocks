import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

import { CREATE_ZONE, MODIFY_ZONE } from '../../../constants/permissions'

import PageHeader from '../../layout/page-header'
import TruncatedTitle from '../../truncated-title'
import IsAllowed from '../../is-allowed'
import UDNButton from '../../button'
import DomainSelector from '../../global-account-selector/selector-component'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain, searchFunc, searchValue }) => {
  const sortedDomains = domains.sort((a,b) => {
    if (a.id.toLowerCase() < b.id.toLowerCase()) return -1
    if (a.id.toLowerCase() > b.id.toLowerCase()) return 1
    return 0
  })
  return (
    <PageHeader secondaryPageHeader={true} distributedColumns={true}>
      {domains.length > 0 || searchValue !== '' ?
        <DomainSelector
          items={sortedDomains.map(domain => [domain.id, domain.id])}
          onItemClick={changeActiveDomain}
          searchValue={searchValue}
          onSearch={searchFunc}>
            <div className="dropdown-toggle header-toggle">
              <h4><TruncatedTitle content={activeDomain} tooltipPlacement="bottom"/></h4><span className="caret"></span>
            </div>
        </DomainSelector> :
        <h4 className="selector-component">No Domains</h4>}
      <ButtonToolbar>
        <IsAllowed to={CREATE_ZONE}>
          <UDNButton
            id="add-domain"
            bsStyle="success"
            icon={true}
            onClick={onAddDomain}>
            <IconAdd/>
          </UDNButton>
        </IsAllowed>
        {activeDomain &&
          <IsAllowed to={MODIFY_ZONE}>
            <UDNButton
            id="edit-domain"
            bsStyle="primary"
            icon={true}
            onClick={() => onEditDomain(activeDomain)}>
            <IconEdit/>
          </UDNButton>
        </IsAllowed>}
      </ButtonToolbar>
    </PageHeader>
  )
}

DomainToolbar.propTypes = {
  activeDomain: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  domains: PropTypes.array,
  fetchDomains: PropTypes.func,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}

export default DomainToolbar
