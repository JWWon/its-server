import { apiHelper } from './api-helper'
import { throws } from 'smid'
import { sample, sampleSize, forEach } from 'lodash'

const provinces = [
  '서울',
  '부산',
  '강원',
  '충남',
  '경기',
  '인천',
  '충북',
  '전북',
  '광주',
  '울산',
  '전남',
  '경남',
  '대전',
  '세종',
  '경북',
  '제주'
]
const cities = {
  서울: [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구'
  ],
  부산: [
    '금정구',
    '기장군',
    '남구',
    '동구',
    '동래구',
    '부산진구',
    '북구',
    '사상구',
    '사하구',
    '서구',
    '수영구',
    '연제구',
    '영도구',
    '해운대구'
  ],
  대구: ['달서구', '달성군', '수성구'],
  인천: [
    '강화군',
    '계양구',
    '남동구',
    '미추홀구',
    '부평구',
    '서구',
    '연수구',
    '옹진군',
    '중구'
  ],
  광주: ['광산구'],
  대전: ['대덕구', '유성구'],
  울산: ['울주군'],
  경기: [
    '가평군',
    '고양시',
    '과천시',
    '광명시',
    '광주시',
    '구리시',
    '군포시',
    '김포시',
    '남양주시',
    '동두천시',
    '부천시',
    '성남시',
    '수원시',
    '시흥시',
    '안성시',
    '양주시',
    '양평군',
    '안산시',
    '안양시',
    '여주시',
    '연천군',
    '오산시',
    '용인시',
    '의왕시',
    '의정부시',
    '이천시',
    '파주시',
    '평택시',
    '포천시',
    '하남시',
    '화성시'
  ],
  강원: [
    '강릉시',
    '고성군',
    '동해시',
    '삼척시',
    '속초시',
    '양구군',
    '양양군',
    '영월군',
    '원주시',
    '인제군',
    '정선군',
    '철원군',
    '춘천시',
    '태백시',
    '평창군',
    '홍천군',
    '화천군',
    '횡성군'
  ],
  충북: [
    '괴산군',
    '단양군',
    '보은군',
    '영동군',
    '옥천군',
    '음성군',
    '제천시',
    '증평군',
    '진천군',
    '청주시',
    '충주시'
  ],
  충남: [
    '계룡시',
    '공주시',
    '금산군',
    '논산시',
    '당진시',
    '보령시',
    '부여군',
    '서산시',
    '서천군',
    '아산시',
    '예산군',
    '천안시',
    '청양군',
    '태안군',
    '홍성군'
  ],
  전북: [
    '고창군',
    '군산시',
    '김제시',
    '남원시',
    '무주군',
    '부안군',
    '순창군',
    '완주군',
    '익산시',
    '임실군',
    '장수군',
    '전주시',
    '정읍시',
    '진안군'
  ],
  전남: [
    '강진군',
    '고흥군',
    '곡성군',
    '광양시',
    '구례군',
    '나주시',
    '담양군',
    '목포시',
    '무안군',
    '보성군',
    '순천시',
    '신안군',
    '여수시',
    '영광군',
    '영암군',
    '완도군',
    '장성군',
    '장흥군',
    '진도군',
    '함평군',
    '해남군',
    '화순군'
  ],
  경북: [
    '경산시',
    '경주시',
    '고령군',
    '구미시',
    '군위군',
    '김천시',
    '문경시',
    '봉화군',
    '상주시',
    '성주군',
    '안동시',
    '영덕군',
    '영양군',
    '영주시',
    '영천시',
    '예천군',
    '울릉군',
    '울진군',
    '의성군',
    '청도군',
    '청송군',
    '칠곡군',
    '포항시'
  ],
  경남: [
    '거제시',
    '거창군',
    '김해시',
    '남해군',
    '밀양시',
    '사천시',
    '산청군',
    '양산시',
    '의령군',
    '진주시',
    '창녕군',
    '창원시',
    '통영시',
    '하동군',
    '함안군',
    '함양군',
    '합천군'
  ],
  제주: ['서귀포시', '제주시'],
  세종: [
    '가람동',
    '고운동',
    '금남면',
    '나성동',
    '다정동',
    '대평동',
    '도담동',
    '반곡동',
    '보람동',
    '부강면',
    '새롬동',
    '소담동',
    '소정면',
    '아름동',
    '어진동',
    '연기면',
    '연동면',
    '연서면',
    '장군면',
    '전동면',
    '전의면',
    '조치원읍',
    '종촌동',
    '한솔동'
  ]
}

const generateClinic = () => {
  const names = ['좋은 치과', '나쁜 치과', '이상한 치과']
  const province = sample(provinces)
  const city = sample(cities[province])
  const grade = sample([2, 1, 0, -1])
  const tags = [
    'tag a',
    'tag b',
    'tag c',
    'can a tag have spaces?',
    'hello',
    'world'
  ]
  return {
    province,
    city,
    name: sample(names),
    tags: sampleSize(tags, 3),
    grade
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

  it('cannot create a clinic with invalid certificates', async () => {
    const api = await apiHelper(true)
    const data = generateClinic()
    const { response } = await throws(
      api.clinics.create({
        ...data,
        certificates: {
          association: {
            chief: 3
          }
        }
      })
    )
    expect(response.status).toBe(400)
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

  it('can find clinic counts of a province', async () => {
    const api = await apiHelper()
    const province = sample(provinces)
    const result = await api.clinics.find({ province })
    const provinceCities = cities[province]
    forEach(result, (v, k) => {
      if (!provinceCities.includes(k))
        throw new Error(`Invalid city '${k}' for province '${province}'`)
      expect(v).toBeGreaterThan(0)
    })
  })

  it('can find clinics within a city', async () => {
    const api = await apiHelper()
    const province = sample(provinces)
    const city = sample(cities[province])
    const result = await api.clinics.find({ province, city })
    forEach(result, c => expect(c).toHaveProperty('id'))
  })

  it('can get clinics for banner', async () => {
    const api = await apiHelper()
    const province = sample(provinces)
    const city = sample(cities[province])
    const result = await api.clinics.find({ province, city, banner: true })
    expect(result.length).toBeLessThanOrEqual(3)
    forEach(result, c => expect(c).toHaveProperty('id'))
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

  it('can get count of all clinics', async () => {
    const api = await apiHelper()
    const result = await api.clinics.find({ count: true })
    expect(result).toBeGreaterThan(0)
  })
})
