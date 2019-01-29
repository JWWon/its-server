import { createController } from 'awilix-koa'
import { NotAuthenticated, BadRequest } from 'fejl'

const api = ApnToken => ({
  signin: async ctx => {
    const { email, password } = ctx.request.body
    BadRequest.assert(email, 'Missing email')
    BadRequest.assert(password, 'Missing password')
    BadRequest.assert(!ctx.user, 'Already signed in')
    return ctx.ok(await ctx.signin(email, password))
  },
  signup: async ctx => {
    NotAuthenticated.assert(ctx.user, 'Not allowed')
    const { email, password, nickname } = ctx.request.body
    BadRequest.assert(email, 'Missing email')
    BadRequest.assert(password, 'Missing password')
    return ctx.created(await ctx.signup(email, password, nickname))
  },
  register: async ctx => {
    const { apnToken } = ctx.request.body
    await ApnToken.create({ token: apnToken })
    return ctx.ok()
  }
})

export default createController(api)
  .post('/signin', 'signin')
  .post('/signup', 'signup')
  .post('/register', 'register')
