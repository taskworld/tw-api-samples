'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Promise = require('bluebird')

const tw = require('./taskworld')
const message = require('./message')
const { COMPLETED, DUE_DATE, DELETE_TASK } = require('./actions')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const verificationToken = process.env.VERIFICATION_TOKEN
const PORT = process.env.PORT
const access_token = process.env.ACCESS_TOKEN
const space_id = process.env.SPACE_ID
const list_id = process.env.LIST_ID
const project_id = process.env.PROJECT_ID
const STATUS_COMPLETED = 2

const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(PORT, () => console.log('listening on port:', PORT))

app.post('/actions', urlencodedParser, async (req, res) => {
  res.status(200).end() // best practice to respond with 200 status

  const payload = JSON.parse(req.body.payload)
  const responseURL = payload.response_url
  
  // verify token to make sure the request is coming from slack
  if (verificationToken !== payload.token) {
    res.status(403).end('Access forbidden')
  } else {
    const actions = payload.actions
    const userName = req.body.user_name
    
    const task_id = payload.callback_id
    let task
    let msg
    try {
      await Promise.map(actions, async (action) => {
        switch (action.name) {
          case COMPLETED:
            task = await tw.updateTask(access_token, space_id, action.value, { status: STATUS_COMPLETED })
            msg = message.taskCompleted(task, userName)
            break;
          case DUE_DATE:
            const due_date = action.selected_options[0].value
            task = await tw.updateTask(access_token, space_id, task_id, { due_date })
            msg = message.updateTask(task, userName)
            break;
          case DELETE_TASK:
            await tw.deleteTask(access_token, space_id, task_id)
            msg = message.taskDeleted()
            break;
          default:
            break;
        }
      }, { concurrency: 5 })
      msg.replace_original = true
      message.sendToSlack(payload.response_url, msg)
    } catch (e) {
      res.send('error: ' + e)
    }
  }
})

app.post('/twctask', urlencodedParser, async (req, res) => {
  res.status(200).end() // best practice to respond with 200 status
  const reqBody = req.body 
  const responseURL = reqBody.response_url

  if (verificationToken !== reqBody.token) {
    res.status(403).end('Access forbidden')
  } else {
    const taskTitle = req.body.text
    const userName = req.body.user_name

    const result = await tw.createTask(access_token, space_id, taskTitle, project_id, list_id)
    const task = result.task
    const msg = message.createTask(task, userName)
    message.sendToSlack(responseURL, msg)
  }
})
