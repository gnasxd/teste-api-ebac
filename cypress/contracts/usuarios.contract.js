const Joi = require('joi')

const usuariosSchema = Joi.object({
    usuarios: Joi.array().items({
        nomeUsuario: Joi.string(),
        emailBeltrano: Joi.string(),
        password: Joi.string(),
        administrador: Joi.string().valid('true', 'false'),
        _id: Joi.string()
    }),
    quantidade: Joi.number()
})

export default usuariosSchema;