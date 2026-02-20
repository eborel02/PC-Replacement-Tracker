import mongoose from 'mongoose'
import { EmployeeSchema } from '../models/employeeModels.js'
import { ComputerSchema } from '../models/computersModels.js'

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)
const Computer = mongoose.models.Computer || mongoose.model('Computer', ComputerSchema)

/*====================================/
/    METHOD TO CREATE NEW EMPLOYEE    /
/====================================*/
export const addNewEmployee = async (req, res) => {
    // Try-catch statement to validate that only allowed fields are assigned
    try {
        // Destructure fields from request body
        const {
            employeeName,
            email,
            currentComputer,
            status,
            newComputer,
            notes
        } = req.body

        // Checks if email is already in use so duplicate employees are not added
        const existing = await Employee.findOne({ email })
        if (existing && existing.email) {
            return res.status(400).json({
                message: `Employee already exists with email: ${email}`
            })
        }

        // Checks if currentComputer is already assigned to prevent double assignment errors
        const existingPC = await Employee.findOne({ currentComputer })
        if (existingPC) {
            return res.status(400).json({
                message: `Current computer ${currentComputer} is already assigned to ${existingPC.employeeName}`
            })
        }

        // If status is set to Replaced, newComputer must be provided. If not, return error message
        if (status === 'Replaced' && !newComputer) {
            return res.status(400).json({
                message: `Status cannot be set to Replaced without assigning a new computer.`
            })
        }

        // Create new employee object with provided fields
        const newEmployee = new Employee({
            employeeName,
            email,
            currentComputer,
            status,
            newComputer,
            notes
        })
        
        // Assign new computer if status is set to Replaced and newComputer is provided
        if (status === 'Replaced' && newComputer) {
            const computer = await Computer.findById(newComputer);
            if (!computer) {
                return res.status(404).json({ message: `Computer not found` });
            }
            if (computer.assignedTo) {
                return res.status(400).json({ message: `Computer already assigned to another employee` });
            }
            computer.assignedTo = newEmployee._id
            computer.status = 'Assigned'
            await computer.save()
        }

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
        const employees = await Employee.find().collation({ locale: 'en', strength: 2 }).sort({ employeeName: 1 }).populate('newComputer', 'computerNumber')
        console.log(JSON.stringify(employees, null, 2))

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
        const employee = await Employee.findById(employeeID).populate('newComputer', 'computerNumber')

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

/*========================================/
/    METHOD TO UPDATE EMPLOYEE PARTIAL    /
/========================================*/
export const updateEmployee = async (req, res) => {
    try {
        // Extract ID from URL and updates from request body
        const { employeeID } = req.params
        const updates = req.body

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({
                message: `Invalid employee ID`
            })
        }

        // Find employee by ID to check for existing values and assigned computer before applying updates
        const employee = await Employee.findById(employeeID).populate('newComputer');
        if (!employee) {
            return res.status(404).json({ message: `Employee not found`});
        }

        // Store old computer ID before updates to check if it needs to be unassigned later
        const oldComputerID = employee.newComputer;

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

        // If set to Replaced without a new computer, reject
        if (updates.status === 'Replaced' && !updates.newComputer) {
            return res.status(400).json({
                message: `Status cannot be set to Replaced without assigning a new computer.`
            })
        }

        // If trying to set to Awaiting Action or something other than Replaced but has assigned computer, reject
        if (updates.status !== 'Replaced' && updates.newComputer) {
            return res.status(400).json({
                message: `Employees with an assigned new computer must have status of Replaced. Please change status or unassign computer.`
            })
        }

        // Unassign old computer if status is changing from Replaced to something else
        if (updates.status !== 'Replaced' && employee.newComputer) {
            const previousComputer = await Computer.findById(employee.newComputer._id);
            if (previousComputer) {
                previousComputer.status = 'Available';
                previousComputer.assignedTo = null;
                await previousComputer.save();
            }
            employee.newComputer = null
            employee.status = updates.status || 'Awaiting Action'
        }

        // Assign new computer if status is changing to Replaced
        if (updates.status === 'Replaced' && updates.newComputer) {
            const computer = await Computer.findById(updates.newComputer);
            if (!computer) {
                return res.status(404).json({ message: `Computer not found` });
            }
            if (computer.assignedTo && computer.assignedTo.toString() !== employeeID) {
                return res.status(400).json({ message: `Computer already assigned to another employee` });
            }
            computer.assignedTo = employeeID
            computer.status = 'Assigned'
            await computer.save()

            if (oldComputerID) {
                oldComputerID.assignedTo = null
                oldComputerID.status = 'Available'
                await oldComputerID.save()
            }

            employee.newComputer = updates.newComputer
            employee.status = 'Replaced'
            await employee.save()
        }

        // Apply other updates without affecting assignment logic
        if (updates.employeeName !== undefined) {
            employee.employeeName = updates.employeeName;
        }
        if (updates.email !== undefined) {
            employee.email = updates.email;
        }
        if (updates.currentComputer !== undefined) {
            employee.currentComputer = updates.currentComputer;
        }
        if (updates.notes !== undefined) {
            employee.notes = updates.notes;
        }

        await employee.save();

        // If successful, send success message and return updated employee
        res.status(200).json({
            message: `Employee updated successfully`,
            employee: employee
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

        // Find the employee to delete to check for assigned computer before deletion
        const employeeToDelete = await Employee.findById(employeeID)

        // If employee not found, send error
        if (!employeeToDelete) {
            return res.status(404).json({
                message: `Employee not found`
            })
        }

        // If employee has an assigned new computer, unassign it before deleting employee
        if (employeeToDelete.newComputer) {
            const assignedComputer = await Computer.findById(employeeToDelete.newComputer)
            if (assignedComputer) {
                assignedComputer.assignedTo = null
                assignedComputer.status = 'Available'
                await assignedComputer.save()
            }
        }

        // If successful, send success message and return deleted employee
        const deletedEmployee = await Employee.findByIdAndDelete(employeeID)
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

/*======================================/
/    METHOD TO BULK DELETE EMPLOYEES    /
/======================================*/
export const bulkDeleteEmployees = async (req, res) => {
    try {
        // Extract employeeIDs array from request body and validate it
        const { employeeIDs } = req.body
        if (!Array.isArray(employeeIDs) || employeeIDs.length === 0) {
            return res.status(400).json({
                message: `employeeIDs must be a non-empty array`
            })
        }

        // Validate each ID and check for assigned computers before deletion
        for (const id of employeeIDs) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: `Invalid employee ID: ${id}`
                })
            }
            const employee = await Employee.findById(id)
            if (!employee) {
                return res.status(404).json({
                    message: `Employee not found: ${id}`
                })
            }
            // Unassign any assigned computers for each employee before deletion to prevent orphaned computer records
            if (employee.newComputer) {
                const assignedComputer = await Computer.findById(employee.newComputer)
                if (assignedComputer) {
                    assignedComputer.assignedTo = null
                    assignedComputer.status = 'Available'
                    await assignedComputer.save()
                }
            }
        }

        // Delete all employees in the array
        const deletedEmployees = await Employee.deleteMany({ _id: { $in: employeeIDs } })

        res.status(200).json({
            message: `Employees deleted successfully`,
            count: deletedEmployees.deletedCount
        })
    } catch (err) {
        console.error('Error bulk deleting employees:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}