import express from 'express';
import cors from 'cors';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

app.post('/api/resumes', upload.single('resume'), (req, res) => {

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