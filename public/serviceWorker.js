self.addEventListener('push', function (event) {
  data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body
  })
})