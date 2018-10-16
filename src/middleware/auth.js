import dynamoose from 'dynamoose'
import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'
import { NotFound, Forbidden } from 'fejl'
import { pick } from 'lodash'
import { logger } from '../lib/logger'
import { env } from '../lib/env'

export default () => {
  const User = dynamoose.model('User', {
    email: {
      type: String,
      hashKey: true,
      validate: email => {
        const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return regex.test(String(email).toLowerCase())
      }
    },
    password: String,
    nickname: String
  })

  const signup = async (email, password, nickname) => {
    const hashed = await hash(password, 10)
    const user = await User.create({ email, password: hashed, nickname })
    delete user.password
    return user
  }

  const signin = async (email, password) => {
    const user = await User.get(email)
    NotFound.assert(user, 'User not found')
    Forbidden.assert(
      await compare(password, user.password),
      'Password does not match'
    )
    const data = pick(user, ['email', 'nickname'])
    const token = jwt.sign(data, env.SECRET)
    return { ...data, token }
  }

  // Create initial admin account
  // signup('admin@admin.com', 'admin', '관리자').then((user) => console.log('Admin account created')).catch(console.err)

  return async function(ctx, next) {
    try {
      const headers = ctx.request.headers
      const token = headers && headers.authorization
      if (token) {
        ctx.user = jwt.verify(token, env.SECRET)
        ctx.signup = signup
      } else {
        ctx.signin = signin
      }
      await next()
    } catch (err) {
      /* istanbul ignore next */
      ctx.status = err.statusCode || 500
      /* istanbul ignore next */
      ctx.body = err.toJSON ? err.toJSON() : { message: err.message, ...err }
      /* istanbul ignore next */
      if (!env.EMIT_STACK_TRACE) {
        delete ctx.body.stack
      }
      logger.error('Error in request', err)
    }
  }
}
