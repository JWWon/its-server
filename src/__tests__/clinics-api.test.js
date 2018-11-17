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
  const province = sample(provinces)
  const city = sample(cities[province])
  const name = sample(['좋은 치과', '나쁜 치과', '이상한 치과', '미인 치과'])
  const phone = '010-1234-5678'
  const grade = sample([2, 1, 0, -1])
  const address = `${province} ${city}`
  const landmark = sample([
    '강남역',
    '잠실 종합경기장',
    '압구정 디브릿지',
    '경희대학교 국제캠퍼스'
  ])
  const webpage = 'https://www.instagram.com'
  const timetable = {
    '월, 수, 금': '08:00 - 18:00',
    '화, 목': '10:00 - 22:00',
    '토, 일': '10:00 - 14:00',
    휴무일: '공휴일'
  }
  const directions = {
    도보: '강남역 10번 출구에서 5분 거리',
    자차: '삼성전자 지하에 주차 후 도보 5분'
  }
  const certificates = {
    association: sample([true, false]),
    specialist: {
      chief: sample(['윤계상', '이동욱']),
      school: sample([
        '경희대학교',
        '서울대학교',
        '고려대학교',
        '한양대학교',
        '가톨릭대학교'
      ]),
      period: { startAt: '2014.05.21', endAt: '2018.06.12' }
      // image: sample([
      //   'https://t1.daumcdn.net/cfile/tistory/237DC44E5901A5411C',
      //   ''
      // ])
    },
    invisalign: sample([true, false])
  }
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
    name,
    phone,
    address,
    landmark,
    webpage,
    timetable,
    directions,
    certificates,
    grade,
    tags: sampleSize(tags, 3)
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
    const clinic = generateClinic()
    const created = await api.clinics.create(clinic)

    const gotten = await api.clinics.get(created.id)
    expect(gotten).toEqual(created)
    expect(gotten.createdAt).toBeDefined()
  })

  it('a clinic does not have unpermitted attributes', async () => {
    const adminApi = await apiHelper(true)
    const clinic = generateClinic()
    const created = await adminApi.clinics.create(clinic)

    const api = await apiHelper()
    const gotten = await api.clinics.get(created.id)
    expect(gotten.grade).not.toBeDefined()
    delete clinic.grade
    expect(gotten).toEqual(expect.objectContaining(clinic))
  })

  it('can remove clinic', async () => {
    const api = await apiHelper(true)
    const clinic = generateClinic()
    const created = await api.clinics.create(clinic)

    await api.clinics.remove(created.id)

    const { response } = await throws(api.clinics.get(created.id))
    expect(response.status).toBe(404)
  })

  it('can find clinics', async () => {
    const api = await apiHelper(true)
    const clinic = generateClinic()
    const created = await api.clinics.create(clinic)

    const result = await api.clinics.find({ limit: 10000 })
    expect(result).toContainEqual(created)
  })

  it('admin can find clinics with limit and after', async () => {
    const api = await apiHelper(true)
    const limitResult = await api.clinics.find({ limit: 2 })
    expect(limitResult).toHaveLength(2)
    expect(limitResult[1].id).toBeDefined()

    const afterResult = await api.clinics.find({ after: limitResult[1].id })
    expect(afterResult.length).toBeLessThanOrEqual(100)
    expect(afterResult).toEqual(expect.not.arrayContaining(limitResult))
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

    const result = await api.clinics.find({ keyword: '치과' })
    expect(result.length).toBeGreaterThan(0)
  })

  it('can update clinic', async () => {
    const api = await apiHelper(true)
    const clinic = generateClinic()
    const created = await api.clinics.create(clinic)
    const newName = '제일 좋은 병원'

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
