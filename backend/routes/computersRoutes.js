import { Router } from 'express'
import {
    createComputer,
    getAllComputers,
    getComputerById,
    updateComputer,
    deleteComputer,
    bulkDeleteComputers
} from '../controllers/computersControllers'

const router = Router()

// POST (create) a new computer
router.post('/', createComputer)

// GET all computers
router.get('/', getAllComputers)

// GET specific computer by ID
router.get('/:computerID', getComputerById)

// PATCH (update) a computer by ID
router.patch('/:computerID', updateComputer)

// DELETE multiple computers by IDs
router.delete('/bulk-delete', bulkDeleteComputers)

// DELETE a computer by ID
router.delete('/:computerID', deleteComputer)

export default router