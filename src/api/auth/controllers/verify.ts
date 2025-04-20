import { Request, Response } from 'express';
import { SiweMessage } from 'siwe';

export async function verify(req: Request, res: Response) {
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
      await siweMessage.verify({ signature });
      res.send(true);
  } catch {
      res.send(false);
  }
}
