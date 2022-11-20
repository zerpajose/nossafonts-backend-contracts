import express from 'express'
import { Blob } from 'buffer'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'

import { getIsAllowed, storeFileToIPFS, storeCSSToIPFS, saveToTable, selectAll, selectSearch } from './lib/functions.js'

const PORT = 3000

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})

app.post("/login", async (req, res) => {
  const token = req.headers['authorization']

  const { address } = await Web3Token.verify(token)

  res.cookie('token', token)

  res.json({address: address, token: token})
  
  res.end()
})

app.get("/fonts", (req, res) => {

})

app.get("/fonts/:id", (req, res) => {
  const id = req.params.id

  res.json({respuesta: id})
  res.end()
})

app.post("/fonts", upload.single('file'), async (req, res) => {

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

  const { name } = req.body
  const { filename, buffer } = req.file

  const file_blob = new Blob([buffer])

  // const cid_file = await storeFileToIPFS(file_blob, mimetype)
  // const cid_css = await storeCSSToIPFS(name, style, weight, cid_file)

  fs.unlinkSync(`./uploads/${filename}`);

  res.json({
    name: name,
    filename: filename
  })

  // res.json({
  //   name: name,
  //   style: style,
  //   weight: weight,
  //   cid_css: cid_css
  // })
  
  res.end()
})

app.get("/sql", async (req, res) => {

  const results = await selectAll(req.params.s)

  if(!results.length > 0){
    res.json([])
  }
  else {
    res.json(
      results
    )
  }
  
  res.end()
})

app.get("/sql/:s", async (req, res) => {

  const search = req.params.s
  
  if(search.length <= 2){
    res.send("Search by 3 or more characters")
  }
  else{
    const {columns, rows} = await selectSearch(search)
    
    if(!rows.length > 0){
      res.json([])
    }
    else {
      res.json(
        rows
      )
    }
  }
  
  res.end()
})

app.post("/sql", async (req, res) => {
  const { id, name } = req.body

  const txHash = await saveToTable(id, name)

  res.json({txHash: txHash})
  res.end()
})