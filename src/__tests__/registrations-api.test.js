import { apiHelper } from './api-helper'
import { sample } from 'lodash'
import { throws } from 'smid'

const generate = () => {
  return {
    name: sample(['좋은 치과', '나쁜 치과', '이상한 치과', '미인 치과']),
    phone: '010-1234-5678',
    address: 'Random address',
    manager: {
      name: 'manager',
      phone: '012-3456-7890',
      email: 'ceo@google.com'
    }
  }
}
describe('registrations API', () => {
  it('can create registration', async () => {
    const api = await apiHelper()
    const data = generate()
    const reg = await api.registrations.create(data)

    expect(reg.id).toBeDefined()
    expect(reg.nonexistent).not.toBeDefined()
    expect(reg).toEqual(expect.objectContaining(data))
  })

  it('can get registrations', async () => {
    const api = await apiHelper(true)
    const data = generate()
    const reg = await api.registrations.create(data)
    const result = await api.registrations.find()
    expect(result).toContainEqual(expect.objectContaining(reg))
  })

  it('normal user cannot get registrations', async () => {
    const api = await apiHelper()
    const { response } = await throws(api.registrations.find())
    expect(response.status).toBe(403)
  })

  it('can remove a registration', async () => {
    const api = await apiHelper(true)
    const data = generate()
    const reg = await api.registrations.create(data)
    await api.registrations.remove(reg.id)

    const result = await api.registrations.find()
    expect(result).not.toContainEqual(expect.objectContaining(reg))
  })

  it('normal user cannot remove a registration', async () => {
    const api = await apiHelper()
    const { response } = await throws(api.registrations.remove('randomid'))
    expect(response.status).toBe(403)
  })
})
