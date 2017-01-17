import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'

jest.unmock('../../../util/status-codes')
jest.unmock('../security.jsx')
import { Security } from '../security.jsx'

const privateKey =
`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEApKoUuwvMzh19DpKUnphczLKZQlb87T3osJ0zaOvEowg7aS+2
1HYJeeBZh70dlAA5QbZBeR6n2wM+766AEwyrodik9Kf159mzYkXS7RI/XCO4Jq5e
HSqWm8vLTjz89lK3fstrutttLPUX0q5ixIRvzOVwjPYklCR3Jv0vaVky/3oncpzs
QTcNAfWiBgJ8zwqQlBxR//rrvjuwWAEHpB9l98NFCSBm1O9G7jQ0yPVjAEpDXZ/y
15ycQvvCdsdQZWgTU96/DmYUMsrxtLV7BUNCMD5t0ZIUVlMoj30agEtUJxEqCqdc
HoEBoIRY/6fwZrRXpVy0mxSgs7yQtn5EHFUXVwIDAQABAoIBACgwyzaMPsTgNbHk
3RmInr3nqbijesB9J9pTxESLp0cTr0yRNNLOrKlutOuIoTuKgm8jiP+DF/1A4Y+m
y+PaZ9ntAvYkOMUKQdpuqHjsx0I6BayLSrVbu77zEwBZqnSE4/yysey9ufwLJnFp
1vmYSaF9Lud4/Jyb+ekuSvAvsV7hkZsW8CedPckLnyt5aSfAwAEM0jbce2lLvN3V
feNUqSdqW2TxilRkHJBC7ePtmZ7+FSuGVOjxhTxGLBnJBpa7/SNypVvfy3Iw0DEm
el72rvzCWnJ4/2Ubro0zMIT4yYYKAFRWuspSNZng2fLdHCKyMOw5ZnYu5BDmsIu8
qRMzxsECgYEA0BTo4Wb3UwVb7lfASotR59rTN2NI69jCvE5KyMOLjmm+epuAzDFl
jqLEdZNyh4PAwgdoMFjGAqMJDp5zyk5QlUYsBjNbSnEC7DOCp3UwWJLzvMwVhUzk
GRnMvhTSswemoCVnurZcMzt9KghKpIj6yjKmGLGe/pnDRyFdvYKFzxkCgYEAypWU
n2SQrzIH/314FnaFAIZhL4znewjjDqS4jfzlU53Wp3yWluUdhH/wEIcTYXZldiwa
bvdXbe/p3MB+iVveItb3yE6i9wxrevFP1VUIxE1QdzOmpsDKWkfC9k/LnkLCtv1F
BZM15lXRKB8BYqiurQiJoHa4nzlcjZe7fttpl+8CgYA8YSTmayNvYsm3Up1IxD6j
IbtSgivhzAdN7wYCVcPEMmkEWOU520eV6SNK3ttH+XJQmyefh9MFZtu080O0O59k
gXU642IlKr/nXFcYUogR26qAaVQBVzuFERh5O7+cFadDJzd/VXVRpHyAWuGV9u2X
CLVryvbQ+DtTA5qY6Cv92QKBgQCb9FMZ8b1AYe+uS9Tq1grFwK2IgZyiJtFFMKGz
DQEuQdBB17PGLlNu8V7KGnJdEVxCgOlIi7kOtSb//mBrNgHoKD1QQtlJ/pGvb53Z
yUCafjp3yZd9v+UHYz8/h2ZlS1fCr283P4C69U2y6UuTu+/c3Tm2Ai9WxD3v8uMw
YZEEmQKBgEzl/CbmWWmPGtl0rpIGMxa0GiYX8uQtC0IlHoe6KnVB8OmdSZGhIhL1
z+F8nHsPyCf5FDK0sI8ubSRGX0vi5vz0BlLDu2PcYK3ciRu7ivkfzYYj6oyv2bvE
XSyrN2+B070c3cB91n15ww37wb/A3AseNQJb6+3OM/rH0yUkcV8e
-----END RSA PRIVATE KEY-----`

// self-signed certificate for widgets3.com
const certificate =
`-----BEGIN CERTIFICATE-----
MIIDbDCCAlQCCQDAUDSzQ9HDEDANBgkqhkiG9w0BAQUFADB4MQswCQYDVQQGEwJV
UzETMBEGA1UECBMKQ2FsaWZvcm5pYTEUMBIGA1UEBxMLU2FudGEgQ2xhcmExETAP
BgNVBAoTCFZpZFNjYWxlMRQwEgYDVQQLEwtFbmdpbmVlcmluZzEVMBMGA1UEAxMM
d2lkZ2V0czMuY29tMB4XDTE2MDkyMjA0MTUxMFoXDTE3MDkyMjA0MTUxMFoweDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC1NhbnRh
IENsYXJhMREwDwYDVQQKEwhWaWRTY2FsZTEUMBIGA1UECxMLRW5naW5lZXJpbmcx
FTATBgNVBAMTDHdpZGdldHMzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBAKSqFLsLzM4dfQ6SlJ6YXMyymUJW/O096LCdM2jrxKMIO2kvttR2CXng
WYe9HZQAOUG2QXkep9sDPu+ugBMMq6HYpPSn9efZs2JF0u0SP1wjuCauXh0qlpvL
y048/PZSt37La7rbbSz1F9KuYsSEb8zlcIz2JJQkdyb9L2lZMv96J3Kc7EE3DQH1
ogYCfM8KkJQcUf/66747sFgBB6QfZffDRQkgZtTvRu40NMj1YwBKQ12f8tecnEL7
wnbHUGVoE1Pevw5mFDLK8bS1ewVDQjA+bdGSFFZTKI99GoBLVCcRKgqnXB6BAaCE
WP+n8Ga0V6VctJsUoLO8kLZ+RBxVF1cCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEA
LcxX0Es61O4C/qfx8gvOF9pEcJlREaFqARosLoFXphN+AXDAh8/87KT4arizLsI6
zrTtPud+KZntERr00CkJCBPwvz2WLKO5Q8xZxPQZ7j0V9tN+3Kqt3J4ExiUutZLQ
DwHs+KIlzCFwRx1AfTQCbe8Mu4OCfTBDd8rfSyQ/NPeMhEHfi+pUSv9yFlqivpxh
kD6foozLFe4hc81aKF6lUlYS8PDotzUlWZlQaGcLX/o36fPiKtlOEqcEmiQZ8BRf
Fd0VG0FEbMMFGVO23jj6HaLfIosBHr5Ac4BLMc0PZrQ2yGjGEQQGOL4E6uo7KP+f
otgWtfJAqaTHa0oNV76WwA==
-----END CERTIFICATE-----`

describe('Security', () => {
  let subject, props = null
  beforeEach(() => {
    props = {
      fetchAccountData: jest.genMockFunction(),
      activeAccount: Immutable.Map({name: 'foo'}),
      groups: Immutable.List([Immutable.Map({id: 1})]),
      params: { subPage: 'a' },
      location: {pathname: 'bar'},
      securityActions: {
        toggleActiveCertificates: jest.genMockFunction(),
        changeCertificateToEdit: jest.genMockFunction(),
        deleteSSLCertificate: jest.genMockFunction()
      }
    }
    subject = () => shallow(<Security { ...props }/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})
