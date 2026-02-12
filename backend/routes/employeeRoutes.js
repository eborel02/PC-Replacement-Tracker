import { Router } from 'express'
import {
    addNewEmployee,
    getEmployees,
    getEmployeeWithID,
    updateEmployee,
    updateEmployeePartial,
    deleteEmployee
} from '../controllers/employeeControllers'

const router = Router()

// POST (create) a new employee
router.post('/', addNewEmployee)

// GET all employees
router.get('/', getEmployees)

// GET specific employee by ID
router.get('/:employeeID', getEmployeeWithID)

// PUT (update) an employee by ID
router.put('/:employeeID', updateEmployee)

// PATCH (partial update) an employee by ID
router.patch('/:employeeID', updateEmployeePartial)

// DELETE an employee
router.delete('/:employeeID', deleteEmployee)

export default router