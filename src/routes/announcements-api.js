import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { BadRequest, Forbidden } from 'fejl'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const api = Announcement => ({
  find: async ctx => ctx.ok(await Announcement.scan().exec()),
  create: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.created(
      await Announcement.create({ ...ctx.request.body, id: shortid.generate() })
    )
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
