import { Request, Response } from 'express';

export async function get(req: Request, res: Response) {
  const id = req.params.id;

  res.json({ respuesta: id });
  res.end();
}
