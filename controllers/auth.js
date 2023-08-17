//Aca ponemos toda la logica de las apis de autenticacion, asi no lo tenemos en el archivo de rutas (routes/auth.js)

//Para tener el tipado
const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');//importamos el modelo
const {generarJWT} = require('../helpers/jwt');


//A la response le forzamos el tipado para tener las ventajas del intellisence
//El request es lo que nos llega del usuario, la response es lo que el servidor le responde al usuario
const crearUsuario = async(req = request, res = response) => {

  //console.log(req.body)

  const {name, email, password} = req.body;

  //Esta bueno que trabajemos con un try y un catch para manejar errores
  try {

    //Usamos la fcn findOne con el modelo para saber si ya existe un usuario en la base con ese mail
    let usuario = await Usuario.findOne({email});

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con ese correo'
      })
    }

    //Generamos la instancia del modelo con los datos que queremos guardar
    usuario = new Usuario(req.body);//Le mandamos el body directamente

    //Encriptamos la contraseña
    //Primero generamos el salt, que son la cantidad de vueltas con las que se va a encriptar la contraseña (10 por defecto)
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardamos en la base de datos
    await usuario.save().then(() => console.log('guardado en db'));

    //Generar JWT una vez que se graba en la base y lo autenticamos
    //Almacenamos el token. Como es una promesa podemos hacer el await
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      msg: 'Usuario creado satisfactoriamente',
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error en la creacion del usuario'
    });
  }

}

const loginUsuario = async(req = request, res = response) => {

  const {email, password} = req.body;

  try {
    
    //Confirmar si tenemos un usuario con ese email
    //Usamos la fcn findOne con el modelo para saber si ya existe un usuario en la base con ese mail
    const usuario = await Usuario.findOne({email});

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe'
      })
    }

    //Confirmar las contraseñas
    const validPassword = bcrypt.compareSync(password, usuario.password); //Regresa true - false

    if(!validPassword) {
      res.status(400).json({
        ok: false,
        msg: 'La contraseña es incorrecta'
      });
    }

    //Generar JWT una vez que sabemos que el usuario es valido
    //Almacenamos el token. Como es una promesa podemos hacer el await
    const token = await generarJWT(usuario.id, usuario.name);

    //Aca estamos listos para generar el JSON web token y loguear al usuario
    res.status(200).json({
      ok: true,
      uid: usuario.id,
      msg: 'login usuario exitoso',
      name: usuario.name,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error en login de usuario'
    })
  }
}

const revalidarToken = async(req = request, res = response) => {

    const {uid, name} = req;

    //Generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({
      ok: true,
      msg: 'renew token usuario',
      token
    });
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}