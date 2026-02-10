import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';



const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());


function tempLoggerMiddleware(req: any, res: any, next: any){
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
}

app.use(tempLoggerMiddleware);

function tempFileSecurityCheck(req: any, res: any, next: any){
  // TODO Add file security checking 
  console.log("Checking file extension and content");
  next();
}

app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

app.get('/api/resumes', async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = await fs.promises.readdir(uploadsDir);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'unable to read uploads directory' });
  }
})

app.post('/api/resumes',  upload.single('resume'), tempFileSecurityCheck, (req, res) => {

  const { name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  res.json({ message: 'Resume uploaded successfully', name, file });

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

