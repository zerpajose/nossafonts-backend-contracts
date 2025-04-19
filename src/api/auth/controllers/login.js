export async function login(req, res) {
  const token = req.headers["authorization"];

  const { address } = await Web3Token.verify(token);

  res.cookie("token", token);

  res.json({ address: address, token: token });

  res.end();
}
