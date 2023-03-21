import * as dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response } from 'express';


import pool from './database/dbconnect'; // Use this to establish a db connection see PG docs


const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  console.log('someone called this lmao');
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});