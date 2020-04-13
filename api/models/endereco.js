const mongoose = require('mongoose')
const endereco = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cidade: { type: String, required: true },
    cep: { type: String, required: true },
    bairro: { type: String, required: false },
    logradouro: { type: String, required: true },
    numero: { type: String, required: false }
})

module.exports = mongoose.model('Endereco', endereco)