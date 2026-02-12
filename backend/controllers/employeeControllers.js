import mongoose from 'mongoose'
import { EmployeeSchema } from '../models/employeeModels'

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)

/*====================================/
/    METHOD TO CREATE NEW EMPLOYEE    /
/====================================*/
export const addNewEmployee = async (req, res) => {
    // Try-catch statement to validate that only allowed fields are assigned
    try {
        const {
            employeeName,
            email,
            currentComputer,
            status,
            newComputer,
            notes
        } = req.body

        // checks if email is already in use so duplicate employees are not added
        const existing = await Employee.findOne({ email })
        if (existing) {
            return res.status(400).json({
                message: `Employee already exists with email: ${email}`
            })
        }

        // checks if currentComputer is already assigned to prevent double assignment errors
        const existingPC = await Employee.findOne({ currentComputer })
        if (existingPC) {
            return res.status(400).json({
                message: `Current computer ${currentComputer} is already assigned to ${existingPC.employeeName}`
            })
        }

        const newEmployee = new Employee({
            employeeName,
            email,
            currentComputer,
            status,
            newComputer,
            notes
        })
        
        // 'await' to pause execution until Promise is resolved
        const savedEmployee = await newEmployee.save()

        // If Promise resolves successfully, send successful status message
        res.status(201).json({
            message: `Employee added successfully`,
            employee: savedEmployee
        })
    } 
    // If save fails, catch the error and respond with appropriate error message
    catch (err) {
        console.error('Error adding employee', err)

        // Display proper Validation Error message
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(key => ({
                field:key,
                message: err.errors[key].message
            }))
            return res.status(400).json({
                message: `Validation failed`,
                errors
            })
        }

        // Other errors are logged as server errors
        res.status(500).json({
            message: 'Server error',
            error: err.message
        })
    }
}

/*==================================/
/    METHOD TO GET ALL EMPLOYEES    /
/==================================*/
export const getEmployees = async (req, res) => {
    try {
        // Create employees array that retrieves all employees sorted by name (case insensitive)
        const employees = await Employee.find().collation({ locale: 'en', strength: 2 }).sort({ employeeName: 1 })
        
        // Respond with successful message and all employees
        res.status(200).json({
            message: `Employees retrieved successfully`,
            employees
        })
    }
    // Catch any errors and respond accordingly
    catch (err) {
        console.error('Error fetching employees:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*===================================/
/    METHOD TO GET EMPLOYEE BY ID    /
/===================================*/
export const getEmployeeWithID = async (req, res) => {
    try {
        // Extract ID from URL
        const { employeeID } = req.params

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({
                message: `Invalid employee ID`
            })
        }

        // Find employee by ID
        const employee = await Employee.findById(employeeID)

        // If employee ID doesn't exist return error
        if (!employee) {
            return res.status(404).json({
                message: `Employee not found`
            })
        }

        // If succesful return success message and employee
        res.status(200).json({
            message: `Employee retrieved successfully`,
            employee
        })
    }
    // Catch any errors and respond accordingly
    catch (err) {
        console.error('Error fetching employee:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*================================/
/    METHOD TO UPDATE EMPLOYEE    /
/================================*/
export const updateEmployee = async (req, res) => {
    try {
        const { employeeID } = req.params
        const updates = req.body

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({
                message: `Invalid employee ID`
            })
        }

        // Check for email duplication (if email is being updated)
        if (updates.email) {
            const existingEmail = await Employee.findOne({ email: updates.email, _id: { $ne: employeeID } })
            if (existingEmail) {
                return res.status(400).json({
                    message: `Email ${updates.email} is already assigned to another employee.`
                })
            }
        }

        // Check for currentComputer duplication (if currentComputer is being updated)
        if (updates.currentComputer) {
            const existingPC = await Employee.findOne({ currentComputer: updates.currentComputer, _id: { $ne: employeeID } })
            if (existingPC) {
                return res.status(400).json({
                    message: `Current computer ${updates.currentComputer} is already assigned to another employee.`
                })
            }
        }

        // Find and update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeID,
            updates,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        )

        // If employee could not be found, send error
        if (!updatedEmployee) {
            return res.status(404).json({
                message: `Employee not found`
            })
        }

        // If successful, send success message and return updated employee
        res.status(200).json({
            message: `Employee updated successfully`,
            employee: updateEmployee
        })
    }
    // Catch any errors with updating employee
    catch (err) {
        console.error('Error updating employee:', err)

        // If validation error with mongo occurs, send error message
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(key => ({
                field: key,
                message: err.errors[key].message
            }))
            return res.status(400).json({
                message: `Validation failed`,
                errors
            })
        }

        // If duplication error occurs, send error message
        if (err.code === 11000) {
            return res.status(400).json({
                message: `Duplicate value error: ${JSON.stringify(err.keyValue)}`
            })
        }

        // For other errors send server error message
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*========================================/
/    METHOD TO UPDATE EMPLOYEE PARTIAL    /
/========================================*/
export const updateEmployeePartial = async (req, res) => {
    try {
        const { employeeID } = req.params
        const updates = req.body

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({
                message: `Invalid employee ID`
            })
        }

        // Check for email duplication (if email is being updated)
        if (updates.email) {
            const existingEmail = await Employee.findOne({ email: updates.email, _id: { $ne: employeeID } })
            if (existingEmail) {
                return res.status(400).json({
                    message: `Email ${updates.email} is already assigned to another employee.`
                })
            }
        }

        // Check for currentComputer duplication (if currentComputer is being updated)
        if (updates.currentComputer) {
            const existingPC = await Employee.findOne({ currentComputer: updates.currentComputer, _id: { $ne: employeeID } })
            if (existingPC) {
                return res.status(400).json({
                    message: `Current computer ${updates.currentComputer} is already assigned to another employee.`
                })
            }
        }

        // Find and update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeID,
            { $set: updates },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        )

        // If employee could not be found, send error
        if (!updatedEmployee) {
            return res.status(404).json({
                message: `Employee not found`
            })
        }

        // If successful, send success message and return updated employee
        res.status(200).json({
            message: `Employee updated successfully`,
            employee: updateEmployee
        })
    }
    // Catch any errors with updating employee
    catch (err) {
        console.error('Error updating employee:', err)

        // If validation error with mongo occurs, send error message
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(key => ({
                field: key,
                message: err.errors[key].message
            }))
            return res.status(400).json({
                message: `Validation failed`,
                errors
            })
        }

        // If duplication error occurs, send error message
        if (err.code === 11000) {
            return res.status(400).json({
                message: `Duplicate value error: ${JSON.stringify(err.keyValue)}`
            })
        }

        // For other errors send server error message
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*================================/
/    METHOD TO DELETE EMPLOYEE    /
/================================*/
export const deleteEmployee = async (req, res) => {
    try {
        const { employeeID } = req.params

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({
                message: `Invalid employee ID`
            })
        }

        // Delete the employee
        const deletedEmployee = await Employee.findByIdAndDelete(employeeID)

        // If employee not found, send error
        if (!deletedEmployee) {
            return res.status(404).json({
                message: `Employee not found`
            })
        }

        // If successful, send success message and return deleted employee
        res.status(200).json({
            message: `Employee deleted successfully`,
            employee: deletedEmployee
        })
    }
    // Catch any errors and respond accordingly
    catch (err) {
        console.error('Error deleting employee:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}