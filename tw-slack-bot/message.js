'use strict'
const Actions = require('./actions')

const taskCompleted = (task, userName) => {
  const msg = taskMessage(task, userName,  'Your task has been completed!')
  return msg
}

const createTask = (task, userName) => {
  const msg = taskMessage(task, userName, 'Your task has been created!')
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
        "color": "good",
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

const deleteTask = "task deleted!"
const invalidAction = "Your action is invalid"

module.exports = {
  taskCompleted,
  createTask,
  updateTask,
  deleteTask, 
  invalidAction
}