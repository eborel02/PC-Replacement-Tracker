import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const ComputerSchema = new Schema({
    // Computer number
    computerNumber: {
        type: String,
        required: true,
        unique: true
    },
    // Status of the computer
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Maintenance'],
        default: 'Available',
        required: true
    },
    // Assigned to which employee (if any)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'Employee',
        default: null
    },
    // Any notes about the computer
    notes: String,
    // track creation and update timestamps
}, { timestamps: true })