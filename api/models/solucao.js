const mongoose = require('mongoose')
const solucao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', require: true },
    nome: { type: String, require: true },
    tipo: { type: String },
    instituicao: { type: String },
    inicio: { type: Date },
    fim: { type: Date },
    descricao: { type: String },
    status: { type: String },
    link_web: { type: String },
    link_youtube: { type: String },
    endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'Endereco' },
    area_aplicacao: { type: String, require: true },
    negocio: { type: String, require: true },
})

module.exports = mongoose.model('Solucao', solucao)

