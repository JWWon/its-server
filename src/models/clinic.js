import dynamoose, { Schema } from 'dynamoose'
import { isValid } from '../lib/validate'

const Clinic = dynamoose.model(
  'Clinic',
  new Schema(
    {
      id: {
        type: String,
        hashKey: true
      },
      province: {
        type: String,
        index: {
          global: true,
          rangeKey: 'city'
        }
      },
      city: String,
      name: String,
      phone: String,
      address: String,
      landmark: String,
      webpage: String,
      timetable: Object,
      // ex. { '월, 수, 금': '1시 ~ 7시', '화': '2시 ~ 5시', '기타': '휴무' }
      director: String,
      directions: Object,
      // ex. { '도보': '불가능', '버스': '30분', '비행기': '인천공항에서 택시' }
      certificates: {
        type: Object,
        validate: c => {
          const model = {
            association: Boolean,
            invisalign: Boolean,
            specialist: {
              chief: String,
              school: String,
              period: {
                startAt: String,
                endAt: String
              },
              image: String
            }
          }
          return isValid(c, model)
        }
      },
      hits: Number,
      grade: {
        type: Number, // 2: A, 1: B, 0: C, -1: D
        validate: g => [2, 1, 0, -1].includes(g)
      },
      hidden: Boolean,
      tags: {
        type: String,
        // query의 filter에서 사용하는 값도 validate, set 거치므로
        // 키워드 검색에 문제가 없도록 하기 위해 string도 허용
        validate: tags => Array.isArray(tags) || typeof tags === 'string',
        set: tags => (typeof tags === 'string' ? tags : JSON.stringify(tags)),
        get: tagsString => {
          const tags = JSON.parse(tagsString)
          return Array.isArray(tags) ? tags : []
        }
      }
    },
    { timestamps: true }
  )
)

export default Clinic
