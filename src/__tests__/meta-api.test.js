import { apiHelper } from './api-helper'
import { throws } from 'smid'

const data = { president: 'ABC', manager: 'CDE' }

describe('meta API', () => {
  it('can update', async () => {
    const api = await apiHelper(true)
    const updated = await api.meta.update(data)
    expect(updated).toEqual(expect.objectContaining(data))
  })

  it('normal user cannot update', async () => {
    const api = await apiHelper()
    const { response } = await throws(api.meta.update(data))
    expect(response.status).toBe(403)
  })

  it('can get meta', async () => {
    const api = await apiHelper()
    const meta = await api.meta.get()
    expect(meta).toEqual(expect.objectContaining(data))
  })
})
