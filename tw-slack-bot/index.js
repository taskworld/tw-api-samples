'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const WebClient = require('@slack/client')
const IncomingWebhook = require('@slack/client').IncomingWebhook 

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const webhookUrl = process.env.WEBHOOK_URL
const PORT = process.env.PORT
const access_token = process.env.ACCESS_TOKEN
const space_id = process.env.SPACE_ID

const webhook = new IncomingWebhook(webhookUrl)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(PORT, () => console.log('listening on port:', PORT))

app.get('/', (req, res) => {
    res.send('index')
})
app.post('/ngrok', (req, res) => {
    res.send('Tunnel is up and running!')
})

app.post('/twctask', (req, res) => {
    res.send({
        text: "Task Created.",
        attachments: [
            {
                text: req.body.text
            }
        ]
    })
})
