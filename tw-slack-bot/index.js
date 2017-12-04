'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const WebClient = require('@slack/client')
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(PORT, () => console.log('listening on port:', PORT))

app.post('/actions', async (req, res) => {
  const payload = JSON.parse(req.body.payload)
  // verify token to make sure the request is coming from slack
  if (verificationToken !== payload.token) {
    res.send('token not verified...')
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
            const result = await tw.deleteTask(access_token, space_id, task_id)
            if (result.ok === true) {
              msg = message.deleteTask
            } else {
              throw new Error('could not delete task')
            }
            break;
          default:
            msg = message.invalidAction
            break;
        }
      }, { concurrency: 5 })
      res.send(msg)
    } catch (e) {
      res.send('error: ' + e)
    }
  }
})

app.post('/twctask', async (req, res) => {
  if (verificationToken !== req.body.token) {
    res.send('token not verified...')
  } else {
    const taskTitle = req.body.text
    const userName = req.body.user_name

    const result = await tw.createTask(access_token, space_id, taskTitle, project_id, list_id)
    const task = result.task
    const msg = message.createTask(task, userName)
    res.send(msg)
  }
})
