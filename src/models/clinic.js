import dynamoose from 'dynamoose'

const Clinic = dynamoose.model('Clinic', {
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
  certificates: Object,
  createdAt: String, // Parsable with either Date or moment
  hits: Number,
  grade: Number, // 2: A, 1: B, 0: C, -1: D
  hidden: Boolean,
  tags: {
    type: 'list',
    list: [String]
  }
})

export default Clinic
