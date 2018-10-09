import { createServer } from '../lib/server'
import { memoize } from 'lodash'
import axios from 'axios'

const adminUser = {
  email: 'admin@admin.com',
  password: 'admin'
}

/**
 * API helper to make it easier to test endpoints.
 */
export async function apiHelper(admin) {
  const server = await startServer()
  const baseURL = `http://127.0.0.1:${server.address().port}`
  const { token } = admin
    ? await axios.post(baseURL + '/signin', adminUser).then(assertStatus(200))
    : {}
  const client = axios.create({
    baseURL,
    headers: token ? { Authorization: token } : undefined
  })

  return {
    catch: catchAndLog, // Useful for logging failing requests
    client,
    signup: data => client.post('/signup', data).then(assertStatus(201)),
    clinics: {
      find: params =>
        client.get(`/clinics`, { params }).then(assertStatus(200)),
      get: id => client.get(`/clinics/${id}`).then(assertStatus(200)),
      create: data => client.post('/clinics', data).then(assertStatus(201)),
      update: (id, data) =>
        client.patch(`/clinics/${id}`, data).then(assertStatus(200)),
      remove: id => client.delete(`/clinics/${id}`).then(assertStatus(204))
    },
    meta: {
      get: () => client.get('/meta').then(assertStatus(200)),
      update: data => client.patch('/meta', data).then(assertStatus(200))
    }
  }
}

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status) {
  return async function statusAsserter(resp) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.request.method} ${
          resp.request.path
        }`
      )
    }
    return resp.data
  }
}

function catchAndLog(err) {
  if (err.response) {
    console.error(
      `Error ${err.response.status} in request ${err.response.request.method} ${
        err.response.request.path
      }`,
      err.response.data
    )
  }
  throw err
}

const startServer = memoize(async () => {
  return (await createServer()).listen()
})

afterAll(async () => {
  // Server is memoized so it won't start a new one.
  // We need to close it.
  const server = await startServer()
  return new Promise(resolve => server.close(resolve))
})
