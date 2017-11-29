'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const WebClient = require('@slack/client')
const IncomingWebhook = require('@slack/client').IncomingWebhook 

const tw = require('./taskworld')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const webhookUrl = process.env.WEBHOOK_URL
const PORT = process.env.PORT
const access_token = process.env.ACCESS_TOKEN
const space_id = process.env.SPACE_ID
const list_id = process.env.LIST_ID 
const project_id = process.env.PROJECT_ID

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

app.post('/twctask', async (req, res) => {
    
    const result = await tw.createTask(access_token, space_id, req.body.text, project_id, list_id)

    console.log(result)
    res.send({
        "attachments": [
            {
                "fallback": "Required plain-text summary of the attachment.",
                "color": "#27b6ba",
                "pretext": "Your task has been created.",
                "author_name": "Vlasdi",
                "author_link": "",
                "author_icon": "http://flickr.com/icons/bobby.jpg",
                "title": "Title",
                "text": "Go to work",
                "fields": [
                    {
                        "title": "Members",
                        "value": "Rufus",
                        "short": true
                    },
                    {
                        "title": "Tags",
                        "value": "#priority #dev",
                        "short": true
                    }
                ],
                "actions": [
                    {
                        "name": "Due Date",
                        "text": "Add Due Date",
                        "type": "button",
                        "value": "duedate"
                    },
                    {
                        "name": "assign",
                        "text": "Assign members",
                        "type": "button",
                        "value": "maze"
                    },
                    {
                        "name": "game",
                        "text": "Completed",
                        "style": "primary",
                        "type": "button",
                        "value": "maze"
                    },
                    {
                        "name": "game",
                        "text": "Delete Task",
                        "style": "danger",
                        "type": "button",
                        "value": "war",
                        "confirm": {
                            "title": "Are you sure?",
                            "text": "Wouldn't you prefer a good game of chess?",
                            "ok_text": "Yes",
                            "dismiss_text": "No"
                        }
                    }
                ],
                "image_url": "http://my-website.com/path/to/image.jpg",
                "thumb_url": "http://example.com/path/to/thumb.png",
                "footer": "Taskworld",
                "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                "ts": 123456781
            }
        ]
    })
})
