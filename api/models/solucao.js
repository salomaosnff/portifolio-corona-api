const mongoose = require('mongoose')
const solucao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String},
    tipo: { type: String},
    responsavel: { type: String},
    instituicao: { type: String},
    inicio: { type: Date},
    fim: { type: Date},
    cidade: { type: String},
    estado: { type: String},
    pais: { type: String},
    telefone: { type: String},
    email: { type: String},
    link_web: { type: String},
    link_youtube: { type: String},
    mais_informacoes: { type: String},
    status: { type: String},
    pessoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa'},
})

module.exports = mongoose.model('Solucao', solucao)

