const mongoose = require('mongoose')

const forum = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', require: true },
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: Boolean }
})

module.exports = mongoose.model('Forum', forum)