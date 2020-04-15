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
const cidadesRoutes = require('./api/routes/cidade')
const palavraChavesRoutes = require('./api/routes/palavra_chave')
const externo = require('./api/routes/externo')
const forms = require('./api/routes/forms')
const forum = require('./api/routes/forum')

const senha_banco = 'portifolio-corona-api'

mongoose.connect('mongodb+srv://portifolio-corona-api:' +
    senha_banco + '@portifolio-corona-api-mw9mh.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

// Usar as rotas aqui
app.use('/pessoa', pessoaRoutes)
app.use('/endereco', enderecoRoutes)
app.use('/solucao', solucaoRoutes)
app.use('/pais', paisRoutes)
app.use('/palavra_chave', palavraChavesRoutes)
app.use('/estado', estadoRoutes)
app.use('/cidade', cidadesRoutes)
app.use('/externo', externo)
app.use('/forms', forms)
app.use('/forum', forum)

app.use((req, res, next) => {
    const error = new Error('Não encontrado')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app