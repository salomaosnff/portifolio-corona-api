const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Importar as rotas aqui
const pessoaRoutes = require('./api/routes/pessoa')
const enderecoRoutes = require('./api/routes/endereco')
const solucaoRoutes = require('./api/routes/solucao')
const paisRoutes = require('./api/routes/pais')
const estadoRoutes = require('./api/routes/estado')
const cidadeRoutes = require('./api/routes/cidade')
const palavraChaveRoutes = require('./api/routes/palavra_chave')
const externo = require('./api/routes/externo')
const forum = require('./api/routes/forum')
const noticiaRoutes = require('./api/routes/noticia')
const destaqueRoutes = require('./api/routes/destaque')
const coronaNoticias = require('./api/routes/corona_noticia')
const acessoNoticias = require('./api/routes/acesso')
const enviarEmailRoutes = require("./api/routes/enviarEmail");

const senha_banco = 'portifolio-corona-api'

mongoose.connect(
  'mongodb+srv://portifolio-corona-api:' +
  senha_banco +
  '@portifolio-corona-api-mw9mh.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Usar as rotas aqui
app.use('/pessoa', pessoaRoutes)
app.use('/endereco', enderecoRoutes)
app.use('/solucao', solucaoRoutes)
app.use('/pais', paisRoutes)
app.use('/palavra_chave', palavraChaveRoutes)
app.use('/estado', estadoRoutes)
app.use('/cidade', cidadeRoutes)
app.use('/externo', externo)
app.use('/forum', forum)
app.use('/noticia', noticiaRoutes)
app.use('/destaque', destaqueRoutes)
app.use('/corona_noticia', coronaNoticias)
app.use('/acesso', acessoNoticias)
app.use("/enviarEmail", enviarEmailRoutes);


app.use((req, res, next) => {
  const error = new Error('Não encontrado')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
