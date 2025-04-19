export async function get(req, res) {
  const id = req.params.id;

  res.json({ respuesta: id });
  res.end();
}
