import dynamoose from 'dynamoose'

const Image = dynamoose.model('Image', {
  id: {
    type: String,
    hashKey: true
  },
  type: {
    type: String,
    validate: t => ['slide', 'news'].includes(t)
  },
  desktopSrc: String,
  mobileSrc: String,
  alt: String,
  href: String
})

export default Image
