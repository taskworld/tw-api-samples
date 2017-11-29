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

const updateTAsk = 

module.exports = {
    createTask,
    getAllTasklists,
    getTask
}