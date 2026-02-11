import { Router } from "express";
import { upload } from "../middleware/upload"
import path from 'path';
import fs from 'fs';
import { tempFileSecurityCheck } from '../middleware/security';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = await fs.promises.readdir(uploadsDir);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'unable to read uploads directory' });
  }
});


router.post('/', upload.single('resume'), tempFileSecurityCheck, (req, res) => {

  const { name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  res.json({ message: 'Resume uploaded successfully', name, file });

});

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

export default router;
