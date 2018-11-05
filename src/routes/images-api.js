import { createController } from 'awilix-koa'
import shortid from 'shortid'
import { BadRequest, Forbidden } from 'fejl'

const getId = ctx => {
  BadRequest.assert(ctx.params.id, 'No id given')
  return ctx.params.id
}

const api = Image => ({
  find: async ctx => {
    const scan = ctx.query.type
      ? Image.scan('type').eq(ctx.query.type)
      : Image.scan()
    return ctx.ok(await scan.exec())
  },
  create: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const data = ctx.request.body
    BadRequest.assert(data.desktopSrc, 'Missing desktop image')
    BadRequest.assert(data.mobileSrc, 'Missing mobile image')
    BadRequest.assert(
      data.type === 'news'
        ? data.title && data.content
        : !data.title || !data.content,
      'News requires title and content'
    )
    return ctx.created(await Image.create({ ...data, id: shortid.generate() }))
  },
  update: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    const payload = ctx.request.body
    BadRequest.assert(payload, 'No data')
    return ctx.ok(await Image.update({ id: getId(ctx) }, payload))
  },
  remove: async ctx => {
    Forbidden.assert(ctx.user, 'Not allowed')
    return ctx.noContent(await Image.delete({ id: getId(ctx) }))
  }
})

export default createController(api)
  .prefix('/images')
  .get('', 'find')
  .post('', 'create')
  .patch('/:id', 'update')
  .delete('/:id', 'remove')
