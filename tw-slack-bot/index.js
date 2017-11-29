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

app.post('/actions', async (req, res) => {
  const payload = JSON.parse(req.body.payload)
  const response = await ({
    completed: async () => {
      return tw.updateTask(access_token, space_id, payload.actions[0].value, { status: 2 }).catch(e => res.send('oh no! something went wrong. Here is the error: ', e))
    }
  }[payload.actions[0].name])()
  
  res.send({
    "response_type": "in_channel",
    "attachments": [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "callback_id": "hello_callback",
        "color": "good",
        "pretext": "Your task has been completed!",
        "author_name": req.body.user_name,
        "author_link": "",
        "author_icon": "http://flickr.com/icons/bobby.jpg",
        "title": response.title,
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
          },
          {
            "title": "Status",
            "value": "completed",
            "short": false,
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

app.post('/twctask', async (req, res) => {
  // TODO: CHECK TOKEN TO MAKE SURE ITS COMING FROM SLACK
  const result = await tw.createTask(access_token, space_id, req.body.text, project_id, list_id)
  const taskId = result.task.task_id

  res.send({
    "response_type": "in_channel",
    "attachments": [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "callback_id": "hello_callback",
        "color": "#27b6ba",
        "pretext": "Your task has been created.",
        "author_name": req.body.user_name,
        "author_link": "",
        "author_icon": "http://flickr.com/icons/bobby.jpg",
        "title": req.body.text,
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
            "name": "due_date",
            "text": "Add Due Date",
            "type": "button",
            "value": taskId
          },
          {
            "name": "assign_members",
            "text": "Assign members",
            "type": "button",
            "value": taskId
          },
          {
            "name": "completed",
            "text": "Completed",
            "style": "primary",
            "type": "button",
            "value": taskId,
          },
          {
            "name": "delete",
            "text": "Delete Task",
            "style": "danger",
            "type": "button",
            "value": taskId,
            "confirm": {
              "title": "Are you sure you want to delete?",
              "text": "The task will be deleted permanently.",
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
