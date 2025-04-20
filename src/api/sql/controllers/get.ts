import { Request, Response } from 'express';
import { selectAll } from '../../../lib/functions.js';

export async function get(_: Request, res: Response) {
  const results = await selectAll();
  
  res.json(results);
  res.end();
}
