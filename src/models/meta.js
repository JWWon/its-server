import dynamoose from 'dynamoose'
import { isValid } from '../lib/validate'

const Meta = dynamoose.model('Meta', {
  id: {
    type: Number,
    hashKey: true,
    validate: v => v === 0
  },
  president: String,
  manager: String,
  registration: String,
  email: String,
  phone: String,
  address: String,
  social: {
    type: Object,
    validate: s => {
      const model = {
        facebook: String,
        instagram: String,
        blog: String
      }
      return isValid(s, model)
    }
  },
  content: String // 잇츠교정 소개
})

export default Meta
