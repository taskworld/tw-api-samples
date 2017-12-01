'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const WebClient = require('@slack/client')
const IncomingWebhook = require('@slack/client').IncomingWebhook
const Promise = require('bluebird')

const tw = require('./taskworld')
const { COMPLETED, ASSIGN_MEMBERS, DUE_DATE } = require('./actions')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const verificationToken = process.env.VERIFICATION_TOKEN
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
  console.log('received action...')
  
  //verifyToken(req.body.payload.token)
  const payload = JSON.parse(req.body.payload)
  console.log('calling tw api...')
  console.log(payload)
  const actions = payload.actions
  const task_id = payload.callback_id
  let task
  await Promise.map(actions, async (action) => {
    switch (action.name) {
      case COMPLETED:
        task = await tw.updateTask(access_token, space_id, action.value, { status: 2 }).catch(e => res.send('oh no! something went wrong. Here is the error: ', e))
        break;
      case DUE_DATE:
        console.log(action.name)
        const due_date = action.value
        task = await tw.updateTask(access_token, space_id, task_id, { due_date }).catch(e => res.send('oh no! something went wrong. Here is the error: ' + e))
        break;
      case ASSIGN_MEMBERS:
        // task = await tw.updateTask(access_token, space_id, task_id, { members: XXXX })

        break;
      default:
        break;
    }
  }, { concurrency: 5 })
  console.log('sending back response...')
  console.log('[res]', task)
  const message = tw.createTaskMessage(task, req.body.user_name)
  res.send(message)
})

app.post('/twctask', async (req, res) => {
  // TODO: CHECK TOKEN TO MAKE SURE ITS COMING FROM SLACK
  // verifyToken(req.body.token)
  const result = await tw.createTask(access_token, space_id, req.body.text, project_id, list_id)
  const taskId = result.task.task_id
  res.send({
    "response_type": "in_channel",
    "attachments": [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "callback_id": taskId,
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
            "type": "select",
            "options": [
              {
                "text": "tomorrow",
                "value": "tomorrow"
              },
              {
                "text": "in 2 day",
                "value": "in2days"
              },
            ]
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

const verifyToken = (token) => {
  if (verificationToken !== token) {
    throw new Error("token not verified")
  }
}
