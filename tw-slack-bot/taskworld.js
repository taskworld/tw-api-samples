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
    const result = await client.post(API_URL + '/task.update', {
        access_token,
        space_id,
        task_id,
        status: data.status
    })
    return result.data.task
}

module.exports = {
    createTask,
    getAllTasklists,
    getTask,
    updateTask
}