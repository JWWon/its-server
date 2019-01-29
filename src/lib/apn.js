import { Provider, Notification } from 'apn'
import path from 'path'

const provider = new Provider({
  token: {
    key: path.resolve(__dirname, '../../AuthKey_K4QFJ5BYPV.p8'),
    keyId: 'K4QFJ5BYPV',
    teamId: '4APG4YR4B6'
  },
  production: process.env.NODE_ENV === 'production'
})

export const send = (notification, recipients) => {
  const note = Notification(notification)
  return provider.send(note, recipients)
}
