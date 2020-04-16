const mongoose = require('mongoose')
const pessoa = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    email: { type: String, required: true }, // nome_usuario é o email
    telefone: { type: String, required: true },
    cpf: { type: String },
    cnpj: { type: String },
    tipo: { type: String, required: true },
    // nome_usuario: { type: String, required: true },
    senha: { type: String, required: true },
    colaborador: { type: Boolean },
    investidor: { type: Boolean },
    cliente: { type: Boolean },
    whatsapp: { type: String }
    //endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'Endereco', required: true },
})

module.exports = mongoose.model('Pessoa', pessoa)