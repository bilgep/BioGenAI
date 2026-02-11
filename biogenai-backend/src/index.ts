import express from 'express';
import cors from 'cors';
import resumeRouter from './routes/resume';
import healthRouter from './routes/health';
import { consoleLogger } from './middleware/logger';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/resumes', resumeRouter);
app.use('/api/health', healthRouter);
app.use(consoleLogger)

// function tempLoggerMiddleware(req: any, res: any, next: any) {
//   console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
//   next();
// }

// app.use(tempLoggerMiddleware);

// function tempFileSecurityCheck(req: any, res: any, next: any) {
//   // TODO Add file security checking 
//   console.log("Checking file extension and content");
//   next();
// }

// app.get('/api/health', (req, res) => {
//   res.send({ status: 'OK' });
// });

// app.get('/api/resumes', async (req, res) => {
//   try {
//     const uploadsDir = path.join(process.cwd(), 'uploads');
//     const files = await fs.promises.readdir(uploadsDir);
//     res.json({ files });
//   } catch (error) {
//     res.status(500).json({ error: 'unable to read uploads directory' });
//   }
// });

// app.post('/api/resumes', upload.single('resume'), tempFileSecurityCheck, (req, res) => {

//   const { name } = req.body;
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send({ error: 'No file uploaded' });
//   }

//   res.json({ message: 'Resume uploaded successfully', name, file });

// });

// app.get('/api/resumes/:filename', (req, res) => {
//   const { filename } = req.params;

//   // TODO: Check if filename exists in the DB in production 

//   if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
//     return res.status(400).json({ error: 'Invalid filename' });
//   }

//   const filePath = path.join(process.cwd(), 'uploads', filename);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ error: 'File not found' });
//   }

//   res.download(filePath);

// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

