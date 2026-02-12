import { Router, Request, Response } from 'express';
import { generateBioFromResume, getBioById } from '../services/bio.services';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  const { resumeId } = req.body;
  if (!resumeId || typeof resumeId !== 'number') {
    return res.status(400).json({ error: 'Valid resumeId required' });
  }
  try {
    const generatedBio = await generateBioFromResume(resumeId);
    res.status(201).json({ bioId: generatedBio.id, content: generatedBio.content });
  } catch (err: any) {
    res.status(err.message === 'Resume not found' ? 404 : 503).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
      const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        console.log('Invalid ID param');
        return res.status(400).json({ error: 'Invalid employee id' });
    }
    const id = parseInt(idParam, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid bio ID' });
  try {
    const bio = await getBioById(id);
    if (!bio) return res.status(404).json({ error: 'Bio not found' });
    res.json(bio);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bio' });
  }
});

// (Optional) GET /api/bio/download/:id for PPTX download (to be implemented in Phase 5)

export default router;