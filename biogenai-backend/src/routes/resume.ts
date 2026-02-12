import { Router, Request, Response } from "express";
import upload from "../middleware/upload"
import path from 'path';
import fs from 'fs';
import { tempFileSecurityCheck } from '../middleware/security';
import { prisma } from "../db";

const router = Router();



//#region POST /api/resume/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  // Validate the file presence and size
  if (!req.file) return res.status(400).json({ error: 'File required' })
  if (req.file.size > 5 * 1024 * 1024) return res.status(413).json({ error: 'File too large' })

  // Validate request fields
  if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
    return res.status(400).json({ error: 'Valid employee name required' })
  }

  // Store file with metadata
  try {

    console.log("req.body:", req.body);
    console.log("typeof req.body.name:", typeof req.body.name);
    console.log("req.body.name:", req.body.name);


    // Create record in the DB

    const employee = await prisma.employee.findUnique({
      where: { email: req.body.email.trim() }
    });

    if (!employee) {
      return res.status(400).json({ error: 'Employee not found. Please create employee first.' });
    }

    const resumeRecord = await prisma.resume.create({
      data: {
        employeeId: employee.id,
        fileName: req.file.originalname,
        fileBuffer: new Uint8Array(req.file.buffer),
        uploadedAt: new Date()
      }
    });

    return res.status(201).json({
      resumeId: resumeRecord.id,
      message: 'Resume uploaded successfully'
    })

  } catch (error) {
    console.error('DB error', error);
    res.status(500).json('Database error. Try again later.');
  }
})
//#endregion

//#region GET /api/resume/:id
router.get('/:id', async (req: Request, res: Response) => {
  const idParam = req.params.id;

  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'Invalid employee id' });
  }
  const id = parseInt(idParam, 10);

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid Resume Id' });

  // Get resume from DB by Id
  try {
    const resume = await prisma.resume.findUnique({ where: { id } });
    if (!resume) return res.status(400).json({ error: 'Resume not found' });
    res.json(resume);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
})
//#endregion





// ----------------------------- OBSOLETE---------------------------------------------
// Obsolete: gets file from file system by filename
router.get('/:filename', (req, res) => {
  const { filename } = req.params;

  // TODO: Check if filename exists in the DB in production 

  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);

});

// Gets all files from the file system's uploads folder
router.get('/', async (_req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = await fs.promises.readdir(uploadsDir);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'unable to read uploads directory' });
  }
});

// Obsolete: Uploads file into the file system
router.post('/upload-to-fs', upload.single('resume'), tempFileSecurityCheck, (req, res) => {

  const { name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  res.json({ message: 'Resume uploaded successfully', name, file });

});

export default router;
