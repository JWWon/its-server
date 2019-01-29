import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { BadRequest, Forbidden } from 'fejl'
import { map } from 'lodash'
import { send } from '../lib/apn'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const api = (Announcement, ApnToken) => ({
  find: async ctx => ctx.ok(await Announcement.scan().exec()),
  create: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const announcement = await Announcement.create({
      ...ctx.request.body,
      id: shortid.generate()
    })
    try {
      const tokens = map(await ApnToken.scan().exec(), t => t.token)
      await send({ alert: '새 소식이 등록되었습니다.' }, tokens)
    } catch (e) {
      console.warn('Failed to send push notifications', e)
    }
    return ctx.created(announcement)
  },
  update: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const payload = ctx.request.body
    BadRequest.assert(payload, 'No data')
    return ctx.ok(await Announcement.update({ id: getId(ctx) }, payload))
  },
  remove: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.noContent(await Announcement.delete({ id: getId(ctx) }))
  }
})

export default createController(api)
  .prefix('/announcements')
  .get('', 'find')
  .post('', 'create')
  .patch('/:id', 'update')
  .delete('/:id', 'remove')
