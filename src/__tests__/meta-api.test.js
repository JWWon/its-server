import { apiHelper } from './api-helper'
import { throws } from 'smid'

const data = {
  president: 'ABC',
  manager: 'CDE',
  social: {
    instagram: 'foo',
    facebook: 'bar',
    blog: 'zee'
  }
}

describe('meta API', () => {
  it('can update', async () => {
    const api = await apiHelper(true)
    const updated = await api.meta.update(data)
    expect(updated).toEqual(expect.objectContaining(data))
  })

  it('cannot update with invalid data', async () => {
    const api = await apiHelper(true)
    const { response } = await throws(
      api.meta.update({ ...data, social: { weibo: 'hello' } })
    )
    expect(response.status).toBe(400)
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
