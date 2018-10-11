import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { NotFound, BadRequest, Forbidden } from 'fejl'
import { reduce, filter } from 'lodash'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const api = Clinic => ({
  find: async ctx => {
    const { province, city, keyword, after } = ctx.query
    let query
    if (province) {
      query = Clinic.query('province').eq(province)
      if (city) {
        query = query.where('city').eq(city)
      } else {
        const items = await query.attributes(['city']).exec()
        return ctx.ok(
          reduce(
            items,
            (result, i) => {
              result[i.city] = result[i.city] ? result[i.city] + 1 : 1
              return result
            },
            {}
          )
        )
      }
    }
    query = query || Clinic.scan()
    if (keyword)
      query = query
        .filter('name')
        .contains(keyword)
        .or()
        .filter('landmark')
        .contains(keyword)
    if (after) query = query.startAt(after)
    if (ctx.user) {
      return ctx.ok(await query.exec())
    }
    const permittedAttrs = [
      'id',
      'province',
      'city',
      'name',
      'phone',
      'address',
      'landmark',
      'webpage',
      'director',
      'certificates',
      'hidden'
    ]
    return ctx.ok(
      filter(await query.attributes(permittedAttrs).exec(), c => !c.hidden)
    )
  },
  get: async ctx => {
    const clinic = await Clinic.get(getId(ctx))
    NotFound.assert(clinic, 'Clinic not found')
    // TODO add hits count
    return ctx.ok(clinic)
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
