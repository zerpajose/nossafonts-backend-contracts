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
  const { originalname, buffer } = req.file;

  const nameCss = `${originalname.split(".")[0]}.css`;
  
  const fileBlob = new Blob([buffer]);

  const { cid: cidFontFile } = storeFileToIPFS(fileBlob);
  const cidCssFile = storeCSSToIPFS(name, nameCss, cidFontFile);
  const cidMetadataFile = storeMetadataToIPFS(name, nameCss, cidCssFile);

  // fs.unlinkSync(`./uploads/${filename}`);

  res.json({
    name,
    cidCssFile,
    cidMetadataFile,
  });

  res.end();
}
