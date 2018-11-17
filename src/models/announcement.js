import dynamoose, { Schema } from 'dynamoose'

const Announcement = dynamoose.model(
  'Announcement',
  new Schema(
    {
      id: {
        type: String,
        hashKey: true
      },
      title: String,
      content: String // HTML ex) '<p>보도되었습니다. <img src='foo' /></p>'
    },
    { timestamps: true }
  )
)

export default Announcement
