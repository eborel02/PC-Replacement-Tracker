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