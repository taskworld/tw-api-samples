'use strict'
const Actions = require('./actions')
const request = require('request')

const taskCompleted = (task, userName) => {
  const msg = taskMessage(task, userName, ':white_check_mark: Your task has been completed!')
  return msg
}
const taskDeleted = (task, userName) => {
  const msg = { text: ':x: Your task has been deleted!' }
  return msg
}

const createTask = (task, userName) => {
  const msg = taskMessage(task, userName, ':thumbsup: Your task has been created!')
  msg.attachments[0].actions = [
    Actions.deleteTaskAction(task.task_id),
    Actions.addDueDateAction(),
    Actions.completeTaskAction(task.task_id),
  ]
  return msg
}
const updateTask = (task, userName) => {
  const msg = taskMessage(task, userName, 'Your task has been updated!')
  msg.attachments[0].actions = [
    Actions.deleteTaskAction(task.task_id),
    Actions.addDueDateAction(),
    Actions.completeTaskAction(task.task_id),
  ]
  return msg
}

const taskMessage = (task, userName, pretext) => {
  const due_date_unix = Math.floor(new Date(task.due_date) / 1000)
  const due_date_string = new Date(task.due_date).toDateString()
  return ({
    "response_type": "in_channel",
    "attachments": [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "callback_id": task.task_id,
        "color": "#2eb3b6",
        "pretext": pretext,
        "author_name": userName,
        "title": "Task",
        "text": task.title,
        "fields": [
          {
            "title": "Assigned to",
            "value": task.members === "" ? task.members : 'none',
            "short": true
          },
          {
            "title": "Status",
            "value": task.status === 0 ? 'todo' : 'completed',
            "short": false,
          },
          {
            "title": "Due Date",
            "value": task.due_date !== "" ? '<!date^' + due_date_unix + '^{date_short_pretty} {time}| due on ' + due_date_string + '>' : "none",
          }
        ],
        "footer": "Taskworld Bot",
        "ts": Math.floor(Date.now() / 1000)
      }
    ]
  })
}



const invalidAction = {
  text: "Your action is invalid"
}

const sendToSlack = (responseURL, JSONmessage) => {
  const postOptions = {
    uri: responseURL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: JSONmessage
  }
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
    }
  })
}

module.exports = {
  taskCompleted,
  taskDeleted,
  createTask,
  updateTask,
  invalidAction,
  sendToSlack,
}
