'use strict'

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const WebClient = require('@slack/client')
const Promise = require('bluebird')

const tw = require('./taskworld')
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

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(PORT, () => console.log('listening on port:', PORT))

app.post('/actions', async (req, res) => {
  const payload = JSON.parse(req.body.payload)
  if (verificationToken !== payload.token) {
    res.send('token not verified...')
  }
  const actions = payload.actions
  const task_id = payload.callback_id
  let task
  await Promise.map(actions, async (action) => {
    switch (action.name) {
      case COMPLETED:
        task = await tw.updateTask(access_token, space_id, action.value, { status: 2 }).catch(e => res.send('oh no! something went wrong. Here is the error: ', e))
        res.send(tw.createTaskMessageCompleted(task, req.body.user_name))
        break;
      case DUE_DATE:
        const due_date = action.selected_options[0].value
        task = await tw.updateTask(access_token, space_id, task_id, { due_date }).catch(e => res.send('oh no! something went wrong. Here is the error: ' + e))
        res.send(tw.createTaskMessageWithActions(task, req.body.user_name))
        break;
      case DELETE_TASK:
        const result = await tw.deleteTask(access_token, space_id, task_id)
        if (result.ok === true) {
          res.send("Task deleted!")
        } else {
          res.send("Oh no, something went wrong...")
        }
        break;
      default:
          res.send("Oh no, something went wrong... no actions specified.")
        break;
    }
  }, { concurrency: 5 })
})

app.post('/twctask', async (req, res) => {
  if (verificationToken !== req.body.token) {
    res.send('token not verified...')
  } else {
    console.log('returning task')
    const result = await tw.createTask(access_token, space_id, req.body.text, project_id, list_id)
    const task = result.task

    res.send(tw.createTaskMessageWithActions(task, req.body.user_name))
  }
})
