export const NotificationChannels = {
  createChat: 'createChat',
  chat: 'chat',
};

export default function (
  token: Array<string>,
  title: string,
  body: string,
  channel_id: string,
  data?: {[key: string]: any},
) {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'key=',
    },
    body: JSON.stringify({
      registration_ids: token,
      priority: 'high',
      notification: {
        title: title,
        body: body,
        android_channel_id: channel_id,
      },
      data: data ?? {},
    }),
  });
}
