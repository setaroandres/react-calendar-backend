//retornar solo el ok: true y el msg de la ruta
const {request, response} = require('express');
//Como es la importacion por defecto no necesitamos las llaves
const Evento = require('../models/Evento');

const geteventos = async(req = request, res = response) => {

  //Aca podemos tomar esto pq ya esta logueado y nos lo envia directamente desde el token ua vez que pasa por validar token en el route de events
  //const {uid, name} = req;

  
  try {
    const eventos = await Evento
      .find()
      .populate('user', 'name'); //Con el populate podemos llenar la referencia que le estamos pasando, es como hacer un join. Tbn le podemos especificar solo lo que queremos
    res.status(200).json({
      ok: true,
      eventos
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener evento - Hable con el admin'
    })
  }

}

const crearEvento = async(req = request, res = response) => {
  //Aca podemos tomar esto pq ya esta logueado y nos lo envia directamente desde el token ua vez que pasa por validar token en el route de events
  //const {uid, name} = req;

  //Verificar que tenemos el evento
  //console.log(req.body)

  //Creamos la instancia del modelo para trabajar con ella
  const evento = new Evento(req.body);

  try {

    //Le tenemos que mandar el uid del usuario al evento para que se guarde en la BD. Ese id lo tenemos en la request
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    res.status(201).json({
      ok: true,
      msg: 'Evento guardado en BD',
      eventoGuardado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al guardar evento - Hable con el admin'
    });
  }

  
}

const actualizarEvento = async(req = request, res = response) => {

  //Lo primero que tenemos que hacer es obtener el id del evento que queremos actualizar.
  //Este id viene de los parametros de la url
  const eventoId = req.params.id;

  try {

    //Usamos la fcn findOne con el modelo para saber si existe el evento en la base con ese mail
    const evento = await Evento.findById(eventoId);
    const uid = req.uid;

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe con ese id'
      });
    }

    //Tenemos que ver si la persona que quiere actualizar el evento es la misma que lo creo

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'El usuario no esta autorizado para modificar este id'
      });
    }

    //Aca actualizamos el evento. Le agregamos el user pq no viene el la peticion del usuario
    const nuevoEvento = {
      ...req.body,
      user: uid
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {
      new: true//para que retorne el evento actualizado
    })

    return res.status(200).json({
      ok: true,
      msg: 'Evento Actualizado',
      eventoActualizado
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al actualizar evento - Hable con el admin'
    });
  }

  
}

const eliminarEvento = async(req = request, res = response) => {

  //Lo primero que tenemos que hacer es obtener el id del evento que queremos actualizar.
  //Este id viene de los parametros de la url
  const eventoId = req.params.id;

  try {

    //Usamos la fcn findOne con el modelo para saber si existe el evento en la base con ese mail
    const evento = await Evento.findById(eventoId);
    const uid = req.uid;

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe con ese id'
      });
    }

    //Tenemos que ver si la persona que quiere actualizar el evento es la misma que lo creo

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'El usuario no esta autorizado para modificar este id'
      });
    }

    const eventoEliminado = await Evento.findByIdAndRemove(eventoId)

    return res.status(200).json({
      ok: true,
      msg: 'Evento eliminado exitosamente',
      eventoEliminado
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al borrar evento - Hable con el admin'
    });
  }

  

}

module.exports = {
  geteventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}