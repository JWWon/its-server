import { apiHelper } from './api-helper'

const data = { title: 'Hello', content: 'World' }
let createdId

describe('announcements API', () => {
  it('can create announcement', async () => {
    const api = await apiHelper(true)
    const announcement = await api.announcements.create(data)

    expect(announcement.id).toBeDefined()
    createdId = announcement.id
    expect(announcement.nonexistent).not.toBeDefined()
    expect(announcement).toEqual(expect.objectContaining(data))
  })

  it('can find announcements', async () => {
    const api = await apiHelper()
    const result = await api.announcements.find()
    expect(result).toContainEqual(
      expect.objectContaining({ ...data, id: createdId })
    )
  })

  it('can remove announcement', async () => {
    const api = await apiHelper(true)
    await api.announcements.remove(createdId)

    const result = await api.announcements.find()
    expect(result).not.toContainEqual(
      expect.objectContaining({ ...data, id: createdId })
    )
  })

  it('can update announcement', async () => {
    const api = await apiHelper(true)
    const created = await api.announcements.create({ title: 'To be updated' })
    const newTitle = 'Updated'

    const updated = await api.announcements
      .update(created.id, { title: newTitle })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.title).toBe(newTitle)
  })
})
