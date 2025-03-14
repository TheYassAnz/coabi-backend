import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

dotenv.config();
const app: Application = express();
const PORT: string | number = process.env.POSTGRES_PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


