import { Request, Response } from 'express';
import { generateNonce } from 'siwe';

export function nonce(_: Request, res: Response) {
  res.send(generateNonce());
}
