import { apiHelper } from './api-helper'
import { sample } from 'lodash'

const generateData = () => ({
  title: sample(['Hello', '배가 고프네용', '좋은 이벤트가 있습니다']),
  content:
    '{"MAIN_ABOUT":{"blocks":[{"key":"6ci8g","text":"안녕하세요?","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}}'
})
let createdId

describe('announcements API', () => {
  it('can create announcement', async () => {
    const api = await apiHelper(true)
    const data = generateData()
    const announcement = await api.announcements.create(data)

    expect(announcement.id).toBeDefined()
    createdId = announcement.id
    expect(announcement.nonexistent).not.toBeDefined()
    expect(announcement).toEqual(expect.objectContaining(data))
  })

  /*
  it('can find announcements', async () => {
    const api = await apiHelper()
    const result = await api.announcements.find()
    expect(result).toContainEqual(
      expect.objectContaining({ ...generateData(), id: createdId })
    )
  })
  */

  it('can remove announcement', async () => {
    const api = await apiHelper(true)
    await api.announcements.remove(createdId)

    const result = await api.announcements.find()
    expect(result).not.toContainEqual(
      expect.objectContaining({ ...generateData(), id: createdId })
    )
  })

  it('can update announcement', async () => {
    const api = await apiHelper(true)
    const created = await api.announcements.create(generateData())
    const newTitle = 'Updated'

    const updated = await api.announcements
      .update(created.id, { title: newTitle })
      .catch(api.catch)

    expect(updated.id).toBe(created.id)
    expect(updated.title).toBe(newTitle)
  })
})
