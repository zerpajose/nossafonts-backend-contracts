import {
  storeFileToIPFS,
  storeCSSToIPFS,
  storeMetadataToIPFS,
} from "../../../lib/functions.js";

export async function upload(req, res) {
  /* web3 token authorization */
  /*
  const token = req.cookies.token

  const { address } = await Web3Token.verify(token)

  const isAddressAllowed = await getIsAllowed(address)

  if(!isAddressAllowed){
    res.json({msg: "You are not allowed to upload a font"})
    res.end()
  }
  */

  const { name } = req.body;
  const { filename, originalname, buffer } = req.file;

  const name_css = `${originalname.split(".")[0]}.css`;
  
  const file_blob = new Blob([buffer]);

  const cid_font_file = await storeFileToIPFS(file_blob);
  const cid_css_file = await storeCSSToIPFS(name, name_css, cid_font_file);
  const cid_metadata_file = await storeMetadataToIPFS(name, name_css, cid_css_file);

  // fs.unlinkSync(`./uploads/${filename}`);

  res.json({
    name: name,
    cid_css_file: cid_css_file,
    cid_metadata_file: cid_metadata_file,
  });

  res.end();
}
