import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { NotFound, BadRequest, Forbidden } from 'fejl'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const api = Clinic => ({
  find: async ctx => ctx.ok(await Clinic.scan().exec()), // TODO deal with ctx.query
  get: async ctx => {
    const clinic = await Clinic.get(getId(ctx))
    NotFound.assert(clinic, 'Clinic not found')
    ctx.ok(clinic)
  },
  create: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.created(
      await Clinic.create({ ...ctx.request.body, id: shortid.generate() })
    )
  },
  update: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.ok(await Clinic.update({ id: getId(ctx) }, ctx.request.body))
  },
  remove: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.noContent(await Clinic.delete({ id: getId(ctx) }))
  }
})

export default createController(api)
  .prefix('/clinics')
  .get('', 'find')
  .get('/:id', 'get')
  .post('', 'create')
  .patch('/:id', 'update')
  .delete('/:id', 'remove')
