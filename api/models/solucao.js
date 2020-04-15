const mongoose = require('mongoose')
const solucao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', require: true },
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade', require: true },
    nome: { type: String, require: true },
    area_aplicacao: { type: String },
    negocio: { type: String },
    tipo: { type: String },
    instituicao: { type: String },
    inicio: { type: Date },
    fim: { type: Date },
    descricao: { type: String },
    status: { type: String },
    link_web: { type: String },
    link_youtube: { type: String },
})

module.exports = mongoose.model('Solucao', solucao)