'use strict'

const COMPLETED = 'completed'
const DUE_DATE = 'due_date'
const DELETE_TASK = 'delete_task'

const deleteTaskAction = (id) => ({
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
})
const addDueDateAction = () => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const in2Days = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  return ({
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
    })
}
const completeTaskAction = (id) => ({
  "name": "completed",
  "text": "Completed",
  "style": "primary",
  "type": "button",
  "value": id,
})


module.exports = {
  COMPLETED,
  DUE_DATE,
  DELETE_TASK,
  deleteTaskAction,
  addDueDateAction,
  completeTaskAction
}