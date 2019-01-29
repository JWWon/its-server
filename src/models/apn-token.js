import dynamoose from 'dynamoose'

const ApnToken = dynamoose.model('ApnToken', {
  token: {
    type: String,
    hashKey: true
  }
})

export default ApnToken
