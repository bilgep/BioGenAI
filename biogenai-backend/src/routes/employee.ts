import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || typeof name != 'string' || name.trim().length == 0) {
        return res.status(400).json({ error: 'Valid employee name' });
    }

    // Prisma logic - Create
    try {
        const employee = await prisma.employee.create({
            data: {
                name: name.trim(),
                email: email?.trim() || null
            }
        });

        res.status(201).json(employee);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Employee already exists' });
        }
        return res.status(500).json({ error: 'Failed to create employee' });
    }
});

router.get('/', async (_req: Request, res: Response) => {
    // Prisma Logic - Get Many
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
})

router.get('/:id', async (req: Request, res: Response) => {

    console.log('GET /api/employees/:id called', req.params.id);
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        console.log('Invalid ID param');
        return res.status(400).json({ error: 'Invalid employee id' });
    }
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        console.log('ID is NaN');
        return res.status(400).json({ error: 'Invalid employee id' });
    }

    // Prisma Logic - Fetch Specific Employee
    try {
        console.log('Querying database...');
        const employee = await prisma.employee.findUnique({ where: { id } });
        console.log('Query result:', employee);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        return res.json(employee); 

    } catch (error: any) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch the employee' });
    }

})

router.delete('/:id', async (req: Request, res: Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'Invalid employee id' });
    }
    const id = parseInt(idParam, 10);

    if (isNaN(id)) return res.status(400).json({ error: 'Invalid employee id' });

    // Prisma Logic - Delete a specific employee
    try {
        const employee = await prisma.employee.delete({ where: { id } });
        res.json({ message: 'Employee deleted', employee });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(500).json({ error: 'Failed to delete employee' });
    }
})

export default router;