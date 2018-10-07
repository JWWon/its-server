import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { NotFound } from 'fejl'

const api = Clinic => ({
  find: async ctx => ctx.ok(await Clinic.scan().exec()), // TODO deal with ctx.query
  get: async ctx => {
    const clinic = await Clinic.get(ctx.params.id)
    NotFound.assert(clinic, 'Clinic not found')
    ctx.ok(clinic)
  },
  create: async ctx =>
    ctx.created(
      await Clinic.create({ ...ctx.request.body, id: shortid.generate() })
    ),
  update: async ctx =>
    ctx.ok(await Clinic.update({ id: ctx.params.id }, ctx.request.body)),
  remove: async ctx => ctx.noContent(await Clinic.delete({ id: ctx.params.id }))
})

export default createController(api)
  .prefix('/clinics')
  .get('', 'find')
  .get('/:id', 'get')
  .post('', 'create')
  .patch('/:id', 'update')
  .delete('/:id', 'remove')
