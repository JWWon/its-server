import dynamoose from 'dynamoose'
import { isValid } from '../lib/validate'

const Registration = dynamoose.model('Registration', {
  id: {
    type: String,
    hashKey: true
  },
  name: String,
  phone: String,
  address: String,
  manager: {
    type: Object,
    validate: m => {
      const model = {
        name: String,
        phone: String,
        email: String
      }
      return isValid(m, model)
    }
  },
  certificates: {
    type: Object,
    validate: c => {
      const model = {
        association: String,
        specialist: String,
        invisalign: String
      }
      return isValid(c, model, true)
    }
  }
})

export default Registration
