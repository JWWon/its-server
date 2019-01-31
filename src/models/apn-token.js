import dynamoose, { Schema } from 'dynamoose'

const ApnToken = dynamoose.model(
  'ApnToken',
  new Schema(
    {
      token: {
        type: String,
        hashKey: true
      }
    },
    { timestamps: true }
  )
)

export default ApnToken
