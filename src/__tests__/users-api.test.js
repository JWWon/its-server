import { apiHelper } from './api-helper'
import { throws } from 'smid'
import shortid from 'shortid'

const adminUser = {
  email: 'admin@admin.com',
  password: 'admin'
}

const randomUser = () => {
  return {
    email: `${shortid.generate()}@${shortid.generate()}.com`,
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
    const api = await apiHelper()
    const user = await api.signin(adminUser)

    expect(user.email).toEqual(adminUser.email)
    expect(user.token).toBeDefined()
  })

  it('can signup', async () => {
    const signinApi = await apiHelper()
    const { token } = await signinApi.signin(adminUser)
    expect(token).toBeDefined()

    const api = await apiHelper(token)
    const user = randomUser()
    const created = await api.signup(user)
    expect(created.email).toEqual(user.email)
  })
})
