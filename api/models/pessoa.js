const mongoose = require('mongoose')
const pessoa = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    cpf: { type: String, required: false },
    cnpj: { type: String, required: false },
    tipo: { type: String, required: true },
    senha: { type: String, required: true },
    colaborador: { type: Boolean, required: false },
    investidor: { type: Boolean, required: false },
    cliente: { type: Boolean, required: false },
    endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'Endereco', required: true },
})

module.exports = mongoose.model('Pessoa', pessoa)