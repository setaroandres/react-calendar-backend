const {Schema, model} = require('mongoose');

//Generamos el esquema
const UsuarioSchema = Schema({
  //Aca definimos los campos y el esquema que va a tener la tabla
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
});

//exportamos el modelo y el esquema
module.exports = model('Usuario', UsuarioSchema);