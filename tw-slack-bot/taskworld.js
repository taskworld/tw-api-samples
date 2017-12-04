'use strict'

const Client = require('axios')
const Actions = require('./actions')

const API_URL = 'http://localhost:9801/v1'

const createTask = async (access_token, space_id, title, project_id, list_id) => {
    const result = await Client.post(API_URL + '/task.create', { 
        access_token, 
        space_id, 
        title, 
        project_id, 
        list_id 
    })
    return result.data
}

const getTask = async (access_token, space_id, task_id) => {
    const result = await Client.post(API_URL + '/task.get', { access_token, space_id, task_id })
    return result.data
}

const updateTask = async (access_token, space_id, task_id, data) => {
    const result = await Client.post(API_URL + '/task.update', {
        access_token,
        space_id,
        task_id,
        status: data.status,
        due_date: data.due_date
    })
    return result.data.task
}

const deleteTask = async (access_token, space_id, task_id) => {
    const result = await Client.post(API_URL + '/task.delete', {
        access_token,
        space_id,
        task_id
    })
    return result.data
}


module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask
}