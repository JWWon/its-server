import { apiHelper } from './api-helper'
import { throws } from 'smid'
import shortid from 'shortid'
import { sample } from 'lodash'

const randomUser = () => {
  const domains = ['naver.com', 'gmail.com', 'test.kr']
  return {
    email: `${shortid.generate()}@${sample(domains)}`,
    password: 'random'
  }
}

describe('users API', () => {
  it('cannot signup without signin', async () => {
    const api = await apiHelper()
    const { response } = await throws(api.signup(randomUser()))
    expect(response.status).toBe(401)
  })

  it('can signin', async () => {
    await apiHelper(true)
  })

  it('can signup', async () => {
    const api = await apiHelper(true)
    const user = randomUser()
    const created = await api.signup(user)
    expect(created.email).toEqual(user.email)
  })

  const apnToken = shortid.generate()
  let createdAt
  let updatedAt
  it('can register device token', async () => {
    const api = await apiHelper(true)
    const token = await api.register({ apnToken })
    expect(token.token).toBeDefined()
    createdAt = token.createdAt
    updatedAt = token.updatedAt
  })

  it('can update registered device token', async () => {
    const api = await apiHelper(true)
    const token = await api.register({ apnToken })
    expect(token.createdAt).toEqual(createdAt)
    expect(token.updatedAt).not.toEqual(updatedAt)
  })
})
