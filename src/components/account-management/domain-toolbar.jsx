import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl';

import {
  CREATE_ZONE,
  MODIFY_ZONE,
  DELETE_ZONE
} from '../../constants/permissions'

import PageHeader from '../shared/layout/page-header'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import DomainSelector from '../global-account-selector/selector-component'
import IconAdd from '../shared/icons/icon-add'
import IconEdit from '../shared/icons/icon-edit'
import IconTrash from '../shared/icons/icon-trash'
import IconCaretDown from '../shared/icons/icon-caret-down'

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain, onDeleteDomain, searchFunc, searchValue, emptyDomainsTxt }) => {
  const sortedDomains = domains.sort((a,b) => {
    if (a.id.toLowerCase() < b.id.toLowerCase()) {
      return -1
    }
    if (a.id.toLowerCase() > b.id.toLowerCase()) {
      return 1
    }
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
        {activeDomain &&
        <IsAllowed to={DELETE_ZONE}>
          <Button
            id="delete-domain"
            bsStyle="danger"
            className="btn-icon"
            onClick={() => onDeleteDomain(activeDomain)}>
            <IconTrash/>
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
  onDeleteDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}

export default DomainToolbar
