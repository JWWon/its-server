import dynamoose from 'dynamoose'

const Announcement = dynamoose.model('Announcement', {
  id: {
    type: String,
    hashKey: true
  },
  title: String,
  content: String // HTML ex) '<p>보도되었습니다. <img src='foo' /></p>'
})

export default Announcement
