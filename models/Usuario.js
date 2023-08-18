const {Schema, model} = require('mongoose');

//Generamos el esquema
const UsuarioSchema = Schema({
  //Aca definimos los campos y el esquema que va a tener la coleccion
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

//exportamos el modelo y el esquema
module.exports = model('Usuario', UsuarioSchema);