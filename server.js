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
    if (!subscriptions.find(function (subscription) {
        return subscription.endpoint === request.body.endpoint
    })) {
        subscriptions.push({ endpoint: request.body.endpoint, subscription: request.body })
    }
    response.status(201).json({})
})
app.post(`/notify`, async function (request, response) {
    payload = JSON.stringify({
        title: `Reminder.`,
        body: request.body.text
    })
    subscriptionObject = subscriptions.find(function (subscription) {
        return subscription.endpoint === request.body.endpoint
    })
    if (!subscriptionObject) {
        return response.status(404).json({ message: "Subscription not found" })
    }
    try {
        await webpush.sendNotification(subscriptionObject.subscription, payload)
        response.status(200).json({ message: `Notification sent.` })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Notification sending error." })
    }
});
PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`)
}) 