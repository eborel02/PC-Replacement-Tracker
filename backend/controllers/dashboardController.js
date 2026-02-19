import mongoose from 'mongoose';
import { EmployeeSchema } from '../models/employeeModels.js';
import { ComputerSchema } from '../models/computersModels.js';

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
const Computer = mongoose.models.Computer || mongoose.model('Computer', ComputerSchema);

export const getDashboardData = async (req, res) => {
    try {
        const [
            totalEmployees,
            replaced,
            awaiting,
            pulled,
            totalComputers,
            assigned,
            available,
            maintenance
        ] = await Promise.all([
            Employee.countDocuments(),
            Employee.countDocuments({ status: 'Replaced' }),
            Employee.countDocuments({ status: 'Awaiting Action' }),
            Employee.countDocuments({ status: 'Pulled Without Replacement' }),
            Computer.countDocuments(),
            Computer.countDocuments({ status: 'Assigned' }),
            Computer.countDocuments({ status: 'Available' }),
            Computer.countDocuments({ status: 'Maintenance' })
        ]);

        const completionRate = 
            totalEmployees === 0
            ? 0
            : (((replaced + pulled) / totalEmployees) * 100).toFixed(1);
            console.log('Completion Rate:', completionRate);
            console.log('Total Employees:', totalEmployees);
            console.log('Replaced:', replaced);
            console.log('Pulled:', pulled);

        const shortage = 
            awaiting > available
            ? awaiting - available
            : 0;

        res.json({
            employees: {
                total: totalEmployees,
                replaced,
                awaiting,
                pulled,
            },
            computers: {
                total: totalComputers,
                assigned,
                available,
                maintenance
            },
            operational: {
                completionRate,
                shortage
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};