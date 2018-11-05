import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { BadRequest, Forbidden } from 'fejl'

const api = Registration => ({
  find: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.ok(await Registration.scan().exec())
  },
  create: async ctx => {
    try {
      return ctx.created(
        await Registration.create({
          ...ctx.request.body,
          id: shortid.generate()
        })
      )
    } catch (e) {
      if (e.name === 'ValidationError') return ctx.throw(400, 'Invalid model')
      throw e
    }
  },
  remove: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const { id } = ctx.params
    BadRequest.assert(id, 'Missing id')
    return ctx.noContent(await Registration.delete({ id }))
  }
})

export default createController(api)
  .prefix('/registrations')
  .get('', 'find')
  .post('', 'create')
  .delete('/:id', 'remove')
