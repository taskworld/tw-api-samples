'use strict'

const client = require('axios')
const API_URL = 'http://localhost:9801/v1'

const createTask = (access_token, space_id, title, project_id, list_id) => (
    client.post(API_URL + '/task.create', { access_token, space_id, title, project_id, list_id }).then(response => response.data)
)

const getAllTasklists = (access_token, space_id, project_id) => (
    client.post(API_URL + '/tasklist.get-all', { access_token, space_id, project_id }).then(response => response.data)
)

const getTask = (access_token, space_id, task_id) => (
    client.post(API_URL + '/task.get', { access_token, space_id, task_id }).then(response => response.data)
)

const updateTask = async (access_token, space_id, task_id, data) => {
    console.log(data)
    const result = await client.post(API_URL + '/task.update', {
        access_token,
        space_id,
        task_id,
        status: data.status,
        due_date: data.due_date
    })
    console.log(result.data)
    return result.data.task
}

const createTaskMessage = (task, userName) => (
    {
        "response_type": "in_channel",
        "attachments": [
          {
            "fallback": "Required plain-text summary of the attachment.",
            "callback_id": task.task_id,
            "color": "good",
            "pretext": "Your task has been completed!",
            "author_name": userName,
            "author_link": "",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": task.title,
            "fields": [
              {
                "title": "Members",
                "value": task.members,
                "short": true
              },
              {
                "title": "Status",
                "value": task.status === 0 ? 'todo' : 'completed',
                "short": false,
              },
              {
                "title": "Due Date",
                "value": task.due_date,
              }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Taskworld",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": Date.now()
          }
        ]
      }
)

module.exports = {
    createTask,
    getAllTasklists,
    getTask,
    updateTask,
    createTaskMessage
}