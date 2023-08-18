const {Schema, model} = require('mongoose');

//generamos el schema
const EventoSchema = Schema({
  //Aca definimos los campos y el esquema que va a tener la coleccion
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  user: {
    //Aca le decimos a mongoose que hacemos una referencia al Schema de usuarios, para grabar el usuario que la creo
    //Le decimos el tipo y desp le establecemos la referencia
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

//Aca podemos establecer diferentes configuraciones adicionales
EventoSchema.method('toJSON', function() {
  //Extraemos version y id y todo lo demas se queda en object
  const {__v, _id, ...object} = this.toObject()
  //Reemplazzamos lo que queremos
  object.id = _id;
  return object;
});


module.exports = model('Evento', EventoSchema)