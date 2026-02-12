import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import resumeRouter from './routes/resume';
import healthRouter from './routes/health';
import { consoleLogger } from './middleware/logger';
import employeeRouter from './routes/employee'
import bioRouter from './routes/bio';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/resume', resumeRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/health', healthRouter);
app.use('/api/bio', bioRouter);
app.use(consoleLogger);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log(`Server is running on port ${PORT}`);
});

