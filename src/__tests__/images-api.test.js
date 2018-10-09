import { apiHelper } from './api-helper'
import { sample } from 'lodash'

const data = {
  desktopSrc: 'somewhere',
  mobileSrc: 'elsewhere',
  type: sample(['slide', 'news'])
}
let createdId

describe('images API', () => {
  it('can create image', async () => {
    const api = await apiHelper(true)
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
    const created = await api.images.create({
      desktopSrc: 'foo',
      mobileSrc: 'bar'
    })
    const newSrc = 'updated src'

    const updated = await api.images
      .update(created.id, { desktopSrc: newSrc })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.desktopSrc).toBe(newSrc)
  })
})
