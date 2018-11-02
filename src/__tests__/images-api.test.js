import { apiHelper } from './api-helper'
import { sample } from 'lodash'

const data = {
  desktopSrc: sample([
    'http://static.hubzum.zumst.com/hubzum/2017/07/19/13/25ae58643b56453da421d17a4e42dbc5_780x0c.jpg',
    'https://kpopping.com/uploads/documents/mck_5afe1ebf24e9f.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A8%28BTS%29_180110_%EC%A0%9C_32%ED%9A%8C_%EA%B3%A8%EB%93%A0%EB%94%94%EC%8A%A4%ED%81%AC.png/1200px-%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A8%28BTS%29_180110_%EC%A0%9C_32%ED%9A%8C_%EA%B3%A8%EB%93%A0%EB%94%94%EC%8A%A4%ED%81%AC.png'
  ]),
  mobileSrc: sample([
    'http://www.ballplaya.com/xe/files/attach/images/22648/978/111/ff2014105fd46485f2eb2782db2394c6.png',
    'https://0.soompi.io/wp-content/uploads/2017/09/25015705/BTS-Steve-Aoki.jpg?s=900x600&e=t'
  ]),
  type: sample(['slide', 'news']),
  alt: '이미지입니다'
}
let createdId

describe('images API', () => {
  it('can create image', async () => {
    const api = await apiHelper(true)
    await api.images.create({ ...data, type: 'slide' })
    const image = await api.images.create(data)

    expect(image.id).toBeDefined()
    createdId = image.id
    expect(image.nonexistent).not.toBeDefined()
    expect(image).toEqual(expect.objectContaining(data))
  })

  it('can find images', async () => {
    const api = await apiHelper()
    const result = await api.images.find()
    expect(result).toContainEqual(
      expect.objectContaining({ ...data, id: createdId })
    )
  })

  it('can remove image', async () => {
    const api = await apiHelper(true)
    await api.images.remove(createdId)

    const result = await api.images.find()
    expect(result).not.toContainEqual(
      expect.objectContaining({ ...data, id: createdId })
    )
  })

  it('can update image', async () => {
    const api = await apiHelper(true)
    const created = await api.images.create(data)
    const newSrc =
      'http://www.pennmike.com/news/photo/201803/3167_3201_3622.jpg'

    const updated = await api.images
      .update(created.id, { desktopSrc: newSrc })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.desktopSrc).toBe(newSrc)
  })
})
