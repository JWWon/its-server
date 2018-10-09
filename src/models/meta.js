import dynamoose from 'dynamoose'

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
  address: String
})

export default Meta
