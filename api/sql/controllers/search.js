import {
  selectSearch,
} from "../../../lib/functions.js";

export async function search(req, res) {
  const search = req.params.s;

  if (search.length <= 2) {
    res.send("Search by 3 or more characters");
  } else {
    const { rows } = await selectSearch(search);

    if (!rows.length > 0) {
      res.json([]);
    } else {
      res.json(rows);
    }
  }

  res.end();
}
