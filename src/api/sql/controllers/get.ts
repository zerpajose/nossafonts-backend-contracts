import { Request, Response } from "express";
import {
  selectAll,
} from "../../../lib/functions.js";

export async function get(_: Request, res: Response) {
  const results = await selectAll();

  // if (!results.length > 0) {
  //   res.json([]);
  // } else {
  //   res.json(results);
  // }
  res.json(results);
  res.end();
}
