jest.unmock('../token-authentication')
import { generateTokenHash } from '../token-authentication'

describe('Token Authentication Hash Utils', () => {
  it('Should output hashed strings correctly', () => {
    it('HMAC-SHA1', () => {
      const actual = generateTokenHash('HMAC_SHA1', 'key', 'string')
      const expected = 'b9db74a9a4c8d85c489b16e970040436f7a58ec2'
      expect(actual).toBe(expected)
    })

    it('HMAC-SHA256', () => {
      const actual = generateTokenHash('HMAC_SHA256', 'key', 'string')
      const expected = '97d15beaba060d0738ec759ea31865178ab8bb781b2d2107644ba881f399d8d6'
      expect(actual).toBe(expected)
    })

    it('HMAC-MD5', () => {
      const actual = generateTokenHash('HMAC_MD5', 'key', 'string')
      const expected = '38fc25be306abaee29caa95a980cd645'
      expect(actual).toBe(expected)
    })
  })
})
