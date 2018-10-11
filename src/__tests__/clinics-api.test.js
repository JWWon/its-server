import { apiHelper } from './api-helper'
import { throws } from 'smid'
import { sample } from 'lodash'

const generateClinic = () => {
  const provinces = ['서울', '경기', '강원', '충청', '경상', '전라', '제주']
  const cities = {
    서울: ['관악구', '강남구', '마포구'],
    경기: ['광주시', '안산시', '김포시'],
    강원: ['양주시', '춘천시', '원주시'],
    충청: ['충주시', '청주시'],
    경상: ['경주시', '상주시'],
    전라: ['광주시', '전주시'],
    제주: ['서귀포시']
  }
  const names = ['좋은 치과', '나쁜 치과', '이상한 치과']
  const province = sample(provinces)
  const city = sample(cities[province])
  return {
    province,
    city,
    name: sample(names)
  }
}

describe('clinics API', () => {
  it('can create clinic', async () => {
    const api = await apiHelper(true)
    const data = generateClinic()
    const clinic = await api.clinics.create(data)

    expect(clinic.id).toBeDefined()
    expect(clinic.nonexistent).not.toBeDefined()
    expect(clinic).toEqual(expect.objectContaining(data))
  })

  it('can get clinic', async () => {
    const api = await apiHelper(true)
    const created = await api.clinics.create(generateClinic())

    const gotten = await api.clinics.get(created.id)
    expect(gotten).toEqual(created)
  })

  it('can remove clinic', async () => {
    const api = await apiHelper(true)
    const created = await api.clinics.create(generateClinic())

    await api.clinics.remove(created.id)

    const { response } = await throws(api.clinics.get(created.id))
    expect(response.status).toBe(404)
  })

  it('can find clinics', async () => {
    const api = await apiHelper(true)
    const created = await api.clinics.create(generateClinic())

    const result = await api.clinics.find()
    expect(result).toContainEqual(created)
  })

  it('can find clinics with keyword', async () => {
    const api = await apiHelper()

    const result = await api.clinics.find({ keyword: '병원' })
    expect(result.length).toBeGreaterThan(0)
  })

  it('can update clinic', async () => {
    const api = await apiHelper(true)
    const created = await api.clinics.create(generateClinic())
    const newName = '나쁜 병원'

    const updated = await api.clinics
      .update(created.id, { name: newName })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.name).toBe(newName)
  })
})
