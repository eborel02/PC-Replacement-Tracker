import { Router } from 'express'
import {
    createComputer,
    getAllComputers,
    getComputerById,
    getAvailableEmployees,
    assignComputer,
    unassignComputer,
    updateComputer,
    deleteComputer
} from '../controllers/computersControllers'

const router = Router()

// POST (create) a new computer
router.post('/', createComputer)

// GET employees without computers
router.get('/available-employees', getAvailableEmployees)

// GET all computers
router.get('/', getAllComputers)

// GET specific computer by ID
router.get('/:computerID', getComputerById)

// // PATCH (assign) a computer to an employee
// router.patch('/:computerID/assign', assignComputer)

// // PATCH (unassign) a computer from an employee
// router.patch('/:computerID/unassign', unassignComputer)

// PATCH (update) a computer by ID
router.patch('/:computerID', updateComputer)

// DELETE a computer by ID
router.delete('/:computerID', deleteComputer)

export default router