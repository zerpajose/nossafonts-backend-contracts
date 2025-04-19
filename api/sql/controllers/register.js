import {
  saveToTable,
} from "../../../lib/functions.js";

export async function register(req, res) {
  const { id, name } = req.body;

  const txHash = await saveToTable(id, name);

  res.json({ txHash: txHash });
  res.end();
}
