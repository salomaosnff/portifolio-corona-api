const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    let jsonData = require('./form-respostas.json');
    console.log(jsonData);   
    let parse = JSON.parse(jsonData);
    console.log(parse);       
    res.status(200).json(jsonData)
    // let stringfy = JSON.stringify(jsonData);
    // console.log(stringfy);   
})

module.exports = router


