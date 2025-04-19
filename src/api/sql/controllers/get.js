import {
  selectAll,
} from "../../../lib/functions.js";

export async function get(req, res) {
  const results = await selectAll();

  if (!results.length > 0) {
    res.json([]);
  } else {
    res.json(results);
  }

  res.end();
}
