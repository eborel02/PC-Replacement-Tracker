import { Router } from 'express'
import {
    addNewEmployee,
    getEmployees,
    getEmployeeWithID,
    updateEmployee,
    deleteEmployee,
    bulkDeleteEmployees
} from '../controllers/employeeControllers'

const router = Router()

// POST (create) a new employee
router.post('/', addNewEmployee)

// GET all employees
router.get('/', getEmployees)

// GET specific employee by ID
router.get('/:employeeID', getEmployeeWithID)

// PATCH (partial update) an employee by ID
router.patch('/:employeeID', updateEmployee)

// DELETE multiple employees by IDs
router.delete('/bulk-delete', bulkDeleteEmployees)

// DELETE an employee
router.delete('/:employeeID', deleteEmployee)

export default router