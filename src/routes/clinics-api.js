import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { NotFound, BadRequest, Forbidden } from 'fejl'
import { reduce, chain, shuffle, pick, sampleSize } from 'lodash'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const sortClinics = clinics => {
  const sanitize = clinic => {
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
      'tags',
      'hidden'
    ]
    return pick(clinic, permittedAttrs)
  }
  // Group by grades, and shuffle them
  const groups = chain(clinics)
    .groupBy(c => c.grade)
    .map(clinicGroup => shuffle(clinicGroup))
    .value()
  // Merge the groups, and sanitize values
  return chain(groups)
    .keys()
    .sortBy(k => !k)
    .map(k => groups[k])
    .flatten()
    .filter(c => !c.hidden)
    .map(sanitize)
    .value()
}

const api = Clinic => ({
  find: async ctx => {
    const { province, city, banner, keyword, after, count } = ctx.query
    if (count) {
      const result = await Clinic.scan()
        .count()
        .exec()
      return ctx.ok(result[0])
    }
    let query
    if (province) {
      query = Clinic.query('province').eq(province)
      if (city) {
        query = query.where('city').eq(city)
        if (banner) {
          return ctx.ok(
            sortClinics(
              sampleSize(
                await query
                  .filter('grade')
                  .ge(1)
                  .exec(),
                3
              )
            )
          )
        }
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
        .filter('tags')
        .contains(keyword)
    if (after) query = query.startAt(after)

    const result = await query.exec()
    // 관리자일 경우 그대로 리턴, 아닐 경우 정렬 및 불필요한 데이터 제거 후 전달
    return ctx.ok(ctx.user ? result : sortClinics(result))
  },
  get: async ctx => {
    const clinic = await Clinic.get(getId(ctx))
    NotFound.assert(clinic, 'Clinic not found')
    // TODO add hits count
    return ctx.ok(clinic)
  },
  create: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    try {
      return ctx.created(
        await Clinic.create({ ...ctx.request.body, id: shortid.generate() })
      )
    } catch (e) {
      if (e.name === 'ValidationError') return ctx.throw(400, 'Invalid model')
      throw e
    }
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
