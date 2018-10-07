import { apiHelper } from './api-helper'
import { throws } from 'smid'

const generateClinic = () => {
  return {
    province: '서울',
    city: '관악구',
    name: '좋은 치과'
  }
}

describe('clinics API', () => {
  it('can create clinic', async () => {
    const api = await apiHelper()
    const data = generateClinic()
    const clinic = await api.createClinic(data)

    expect(clinic.id).toBeDefined()
    expect(clinic.nonexistent).not.toBeDefined()
    expect(clinic).toEqual(expect.objectContaining(data))
  })

  it('can get clinic', async () => {
    const api = await apiHelper()
    const created = await api.createClinic(generateClinic())

    const gotten = await api.getClinic(created.id)
    expect(gotten).toEqual(created)
  })

  it('can remove clinic', async () => {
    const api = await apiHelper()
    const created = await api.createClinic(generateClinic())

    await api.removeClinic(created.id)

    const { response } = await throws(api.getClinic(created.id))
    expect(response.status).toBe(404)
  })

  it('can find clinics', async () => {
    const api = await apiHelper()
    const created = await api.createClinic(generateClinic())

    const result = await api.findClinics()
    expect(result).toContainEqual(created)
  })

  it('can update clinic', async () => {
    const api = await apiHelper()
    const created = await api.createClinic(generateClinic())
    const newName = '나쁜 병원'

    const updated = await api
      .updateClinic(created.id, { name: newName })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.name).toBe(newName)
  })
})
