express = require(`express`)
webpush = require(`web-push`)
bodyParser = require(`body-parser`)
path = require(`path`)
app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, `public`)))
vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
}
webpush.setVapidDetails(
    `mailto:mtkn573@proton.me`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
subscriptions = []
app.post(`/subscribe`, function (request, response) {
    subscription = request.body;
    subscriptions.push(subscription)
    response.status(201).json({})
})
app.post(`/notify`, async function (request, response) {
    payload = JSON.stringify({
        title: `Powiadomienie!`,
        body: `To jest testowe Web Push z backendu`
    })
    sendPromises = subscriptions.map(function (subscription) {
        webpush.sendNotification(subscription, payload).catch(function (error) {
            console.error(err)
        })
    })
    await Promise.all(sendPromises)
    response.status(200).json({ message: `Powiadomienia wysłane` })
});
PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`)
})