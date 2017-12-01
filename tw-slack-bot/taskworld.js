'use strict'

const client = require('axios')
const API_URL = 'http://localhost:9801/v1'

const createTask = (access_token, space_id, title, project_id, list_id) => (
    client.post(API_URL + '/task.create', { access_token, space_id, title, project_id, list_id }).then(response => response.data)
)

const getTask = (access_token, space_id, task_id) => (
    client.post(API_URL + '/task.get', { access_token, space_id, task_id }).then(response => response.data)
)

const updateTask = async (access_token, space_id, task_id, data) => {
    const result = await client.post(API_URL + '/task.update', {
        access_token,
        space_id,
        task_id,
        status: data.status,
        due_date: data.due_date
    })
    return result.data.task
}

const deleteTask = async (access_token, space_id, task_id) => {
    const result = await client.post(API_URL + '/task.delete', {
        access_token,
        space_id,
        task_id
    })
    return result.data
}

const createTaskMessageCompleted = (task, userName) => {
    const due_date_unix = Math.floor(new Date(task.due_date)/ 1000)
    const due_date_string = new Date(task.due_date).toDateString()
    return {
        "response_type": "in_channel",
        "attachments": [
          {
            "fallback": "Required plain-text summary of the attachment.",
            "callback_id": task.task_id,
            "color": "good",
            "pretext": "Your task has been completed!",
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
                "value": task.due_date !== "" ? '<!date^' + due_date_unix + '^{date_short_pretty} {time}| due on ' + due_date_string  +'>' : "none",
              }
            ],
            "footer": "Taskworld Bot",
            "ts": Math.floor(Date.now() / 1000)
          }
        ]
      }
    }
const createTaskMessageWithActions = (task, userName) => {
    const actions = createActions(task.task_id)
    const due_date_unix = Math.floor(new Date(task.due_date)/ 1000)
    const due_date_string = new Date(task.due_date).toDateString()

    return {
        "response_type": "in_channel",
        "attachments": [
          {
            "fallback": "Required plain-text summary of the attachment.",
            "callback_id": task.task_id,
            "color": "#27b6ba",
            "pretext": "Your task has been created.",
            "title": "Task",
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
                  "value": task.due_date !== "" ? '<!date^' + due_date_unix + '^{date_short_pretty} {time}| due on ' + due_date_string  +'>' : "none",
                }
              ],
            "text": task.title,
            actions: actions,
            "footer": "Taskworld Bot",
            "ts": Math.floor(Date.now() / 1000)
          }
        ]
      }
}


const createActions = (id) => {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const in2Days = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
    return ([
    {
      "name": "due_date",
      "text": "Add Due Date",
      "type": "select",
      "options": [
        {
          "text": "tomorrow",
          "value": tomorrow.toISOString()
        },
        {
          "text": "in 2 day",
          "value": in2Days.toISOString()
        },
        {
          "text": "next week",
          "value": nextWeek.toISOString()
        }
      ]
    },
    {
      "name": "completed",
      "text": "Completed",
      "style": "primary",
      "type": "button",
      "value": id,
    },
    {
      "name": "delete_task",
      "text": "Delete Task",
      "style": "danger",
      "type": "button",
      "value": id,
      "confirm": {
        "title": "Are you sure you want to delete?",
        "text": "The task will be deleted permanently.",
        "ok_text": "Yes",
        "dismiss_text": "No"
      }
    }
  ])
}
module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    createTaskMessageCompleted,
    createTaskMessageWithActions
}