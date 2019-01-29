import { Provider, Notification } from 'apn'

const provider = new Provider({
  token: {
    // TODO set credentials
    key: 'path/to/APNsAuthKey_XXXXXXXXXX.p8',
    keyId: 'key-id',
    teamId: 'developer-team-id'
  },
  production: process.env.NODE_ENV === 'production'
})

export const send = (notification, recipients) => {
  const note = Notification(notification)
  return provider.send(note, recipients)
}
