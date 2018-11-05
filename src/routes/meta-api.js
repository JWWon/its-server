import { createController } from 'awilix-koa'
import { BadRequest, Forbidden } from 'fejl'

const api = Meta => ({
  get: async ctx => ctx.ok(await Meta.get({ id: 0 })),
  update: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const payload = ctx.request.body
    BadRequest.assert(payload, 'No data')
    try {
      return ctx.ok(await new Meta({ ...payload, id: 0 }).save())
    } catch (e) {
      if (e.name === 'ValidationError') return ctx.throw(400, 'Invalid model')
      throw e
    }
  }
})

export default createController(api)
  .prefix('/meta')
  .get('', 'get')
  .patch('', 'update')
