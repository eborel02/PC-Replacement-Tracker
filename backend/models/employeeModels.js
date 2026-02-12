import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const EmployeeSchema = new Schema({
    // Employee name
    employeeName: {
        type: String,
        required: true
    },
    // Employee email
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Employee's current computer number.
    // Must be unique to prevent duplicates
    currentComputer: {
        type: String,
        required: true
    },
    // Status for PC replacement
    status: {
        type: String,
        enum: ['Awaiting Action', 'Pulled Without Replacement', 'Replaced'],
        default: 'Awaiting Action',
        required: true
    },
    // If replaced, the new computer number
    newComputer: {
        type: mongoose.Schema.Types.ObjectId || null, 
        ref: 'Computer',
        default: null
    },
    // Any notes that may provide more info
    notes: {
        type: String,
    },
    // track creation and update timestamps
},  {timestamps: true})

// Pre-save hook that checks if the status field is 'Replaced'.
// If so, set newComputer number to 'null'
EmployeeSchema.pre('save', function() {
    if (this.status !== 'Replaced') {
        this.newComputer = null
    }
})

// Pre-update hook that checks if an update sets status to anything other than 'Replaced'
// If so, make sure that newComputer is set to 'null'
EmployeeSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
    const update = this.getUpdate()
    const status = update.status || update.$set?.status

    if (status && status !== 'Replaced') {
        this.setUpdate({
            ...update,
            $set: {
                ...update.$set,
                newComputer: null
            }
        })
    }
})