import { Request, Response } from 'express';
import { saveToTable } from '../../../lib/functions.js';

export async function register(req: Request, res: Response) {
  const { id, name } = req.body;

  const txHash = await saveToTable(id, name);

  res.json({ txHash });
  res.end();
}
