import mongoose from 'mongoose'
import { ComputerSchema } from '../models/computersModels.js'
import { EmployeeSchema } from '../models/employeeModels.js'

// Declare models here to avoid circular import issues
const Computer = mongoose.models.Computer || mongoose.model('Computer', ComputerSchema)
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)

/*====================================/
/    METHOD TO CREATE NEW COMPUTER    /
/====================================*/
export const createComputer = async (req, res) => {
    try {
        // Destructure and validate input data
        const { 
            computerNumber, 
            status, 
            assignedTo, 
            notes 
        } = req.body

        // Validation: Assigned computers must have an assigned employee
        if (status === 'Assigned' && !assignedTo) {
            return res.status(400).json({
                message: `Assigned computers must have an assigned employee`
            })
        }

        // Validation: Available computers cannot have an assigned employee
        if (status === 'Available' && assignedTo) {
            return res.status(400).json({
                message: `Available computers cannot have an assigned employee`
            })
        }

        // Validation: Check for duplicate computer number
        const existing = await Computer.findOne({ computerNumber })
        if (existing) {
            return res.status(400).json({
                message: `Duplicate computer number error: ${computerNumber}`
            })
        }

        // Create new computer
        const newComputer = new Computer({
            computerNumber,
            status,
            assignedTo,
            notes
        })

        // Assign employee if status is Assigned
        if (newComputer.assignedTo) {
            const employee = await Employee.findById(newComputer.assignedTo)
            if (!employee) {
                return res.status(404).json({ message: `Employee not found` }) 
            }
            if (employee.newComputer) {
                return res.status(400).json({ message: `Employee already has a computer assigned` })
            }
            employee.newComputer = newComputer._id
            employee.status = 'Replaced'
            await employee.save()
        }

        // Save new computer to database
        const savedComputer = await newComputer.save()
        res.status(201).json({
            message: `Computer created successfully`,
            computer: savedComputer
        })
    } catch (error) {
        res.status(500).json({
            message: `Error creating computer: ${error.message}`
        })
    }
}

/*==================================/
/    METHOD TO GET ALL COMPUTERS    /
/==================================*/
export const getAllComputers = async (req, res) => {
    try {
        // Populate assignedTo with employeeName and email for easier frontend display
        const computers = await Computer.find().populate('assignedTo', 'employeeName email')
        res.status(200).json({
            message: `Computers retrieved successfully`,
            computers
        })
    } catch (error) {
        console.error('getAllComputers error:', error)
        res.status(500).json({
            message: `Error retrieving computers: ${error.message}`
        })
    }
}

/*===================================/
/    METHOD TO GET COMPUTER BY ID    /
/===================================*/
export const getComputerById = async (req, res) => {
    try {
        // Validate computer ID
        const { computerID } = req.params

        if (!mongoose.Types.ObjectId.isValid(computerID)) {
            return res.status(400).json({
                message: `Invalid computer ID`
            })
        }

        // Populate assignedTo with employeeName and email for easier frontend display
        const computer = await Computer.findById(computerID).populate('assignedTo', 'employeeName email')

        // If computer not found, return 404
        if (!computer) {
            return res.status(404).json({
                message: `Computer not found`
            })
        }

        // Return computer data
        res.status(200).json({
            message: `Computer retrieved successfully`,
            computer
        })
    } catch (error) {
        console.error('getComputerById error:', error)
        res.status(500).json({
            message: `Error retrieving computer: ${error.message}`
        })
    }
}

/*================================/
/    METHOD TO UPDATE COMPUTER    /
/================================*/
export const updateComputer = async (req, res) => {
    try {
        // Destructure input data
        const { computerID } = req.params
        const updateData = req.body

        // Validate computer ID
        if (!mongoose.Types.ObjectId.isValid(computerID)) {
            return res.status(400).json({ message: `Invalid computer ID` });
        }

        // Find the computer to update and populate assignedTo for validation checks
        const updatedComputer = await Computer.findById(computerID).populate('assignedTo');
        if (!updatedComputer) {
            return res.status(404).json({ message: `Computer not found`});
        }

        // If trying to assign without employee or set to assigned without employee, reject
        if (updateData.status === 'Assigned' && !updateData.assignedTo) { 
            return res.status(400).json({ message: `Assigned computers must have an assigned employee` });
        }

        // If trying to set to available but has assigned employee, reject
        if (updateData.status !== 'Assigned' && updateData.assignedTo) {
            return res.status(400).json({ message: `Available computers cannot have an assigned employee` })
        }

        // Unassign previous employee if status is changing from Assigned to something else
        if (updateData.status !== 'Assigned' && updatedComputer.assignedTo) {
            const previousEmployee = await Employee.findById(updatedComputer.assignedTo._id);
            if (previousEmployee) {
                previousEmployee.newComputer = null;
                previousEmployee.status = 'Awaiting Action';
                await previousEmployee.save();
            }
            updatedComputer.assignedTo = null
            updatedComputer.status = updateData.status || 'Available'
        }

        // Assign new employee if status is changing to Assigned
        if (updateData.status === 'Assigned' && updateData.assignedTo) {
            const employee = await Employee.findById(updateData.assignedTo);
            if (!employee) {
                return res.status(404).json({ message: `Employee not found` });
            }
            if (employee.newComputer && employee.newComputer.toString() !== computerID) {
                return res.status(400).json({ message: `Employee already has a computer assigned` });
            }
            employee.newComputer = computerID
            employee.status = 'Replaced'
            await employee.save()

            // If the computer was previously assigned to a different employee, unassign it from that employee
            const previousEmployee = updatedComputer.assignedTo ? await Employee.findById(updatedComputer.assignedTo._id) : null;
            if (previousEmployee && previousEmployee._id.toString() !== employee._id.toString()) {
                previousEmployee.newComputer = null;
                previousEmployee.status = 'Awaiting Action';
                await previousEmployee.save();
            }

            // Update computer assignment
            updatedComputer.assignedTo = updateData.assignedTo
            updatedComputer.status = 'Assigned'
            await updatedComputer.save()
        }

        // Apply other updates (like notes) without affecting assignment logic
        if (updateData.notes !== undefined) {
            updatedComputer.notes = updateData.notes;
        }
        if (updateData.computerNumber !== undefined) {
            updatedComputer.computerNumber = updateData.computerNumber;
        }
        if (updateData.status && updateData.status !== 'Assigned') {
            updatedComputer.status = updateData.status;
        }
        
        await updatedComputer.save()

        res.status(200).json({
            message: `Computer updated successfully`,
            computer: updatedComputer
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: `Duplicate computer number error: ${JSON.stringify(err.keyValue)}`
            })
        }
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*================================/
/    METHOD TO DELETE COMPUTER    /
/================================*/
export const deleteComputer = async (req, res) => {
    try {
        // Validate computer ID
        const { computerID } = req.params

        if (!mongoose.Types.ObjectId.isValid(computerID)) {
            return res.status(400).json({
                message: `Invalid computer ID`
            })
        }

        // Find the computer to delete
        const computerToDelete = await Computer.findById(computerID)

        // If computer not found, return 404
        if (!computerToDelete) {
            return res.status(404).json({
                message: `Computer not found`
            })
        }

        // If the computer is assigned to an employee, unassign it and update employee status before deletion
        if (computerToDelete.assignedTo) {
            const employee = await Employee.findById(computerToDelete.assignedTo)
            if (employee) {
                employee.newComputer = null
                employee.status = 'Awaiting Action'
                await employee.save()
            }
        }

        // Delete the computer
        const deletedComputer = await Computer.findByIdAndDelete(computerID)
        res.status(200).json({
            message: `Computer deleted successfully`,
            computer: deletedComputer
        })
    } catch (err) {
        console.error('Error deleting computer:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}

/*======================================/
/    METHOD TO BULK DELETE COMPUTERS    /
/======================================*/
export const bulkDeleteComputers = async (req, res) => {
    try {
        // Validate input data
        const { computerIDs } = req.body
        if (!Array.isArray(computerIDs) || computerIDs.length === 0) {
            return res.status(400).json({
                message: `computerIDs must be a non-empty array`
            })
        }

        // Validate each ID and check for assigned employees before deletion
        for (const id of computerIDs) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: `Invalid computer ID: ${id}`
                })
            }
            const computer = await Computer.findById(id)
            if (!computer) {
                return res.status(404).json({
                    message: `Computer not found: ${id}`
                })
            }
            // If the computer is assigned to an employee, unassign it and update employee status before deletion
            if (computer.assignedTo) {
                const employee = await Employee.findById(computer.assignedTo)
                if (employee) {
                    employee.newComputer = null
                    employee.status = 'Awaiting Action'
                    await employee.save()
                }
            }
        }

        // Delete all computers in the array
        const deletedComputers = await Computer.deleteMany({ _id: { $in: computerIDs } })

        res.status(200).json({
            message: `Computers deleted successfully`,
            count: deletedComputers.deletedCount
        })
    } catch (err) {
        console.error('Error bulk deleting computers:', err)
        res.status(500).json({
            message: `Server error`,
            error: err.message
        })
    }
}
