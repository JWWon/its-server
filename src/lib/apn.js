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

const bundleId = 'com.itso-o.client.ios'
export const send = (notification, recipients) => {
  if (!recipients || recipients.length === 0) {
    console.warn('No recipients specified')
    return Promise.resolve()
  }
  const note = new Notification(notification)
  note.topic = bundleId
  return provider.send(note, recipients).then(result => {
    if (result.failed.length > 0) {
      console.warn(
        `Sent push notifications to ${result.sent.length}, with ${
          result.failed.length
        } failures`
      )
      console.log(result.failed)
    } else {
      console.log(
        `Successfully sent push notifications to ${result.sent.length} devices`
      )
    }
    return result
  })
}
