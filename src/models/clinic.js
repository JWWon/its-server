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
        type: 'list',
        list: [String]
      }
    },
    { timestamps: true }
  )
)

export default Clinic
