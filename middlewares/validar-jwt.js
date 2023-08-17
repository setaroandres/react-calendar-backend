const {request, response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response, next) => {

  //Saber como recibimos el jwt. En esta ocasion lo recibimos en los headers con el x-token: VALUE
  const token = req.header('x-token');

  //Validamos el token. Lo debemos leer de la misma manera que lo generamos
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición'
    })
  }

  //Si hay token hacemos un try y un catch
  try {
    
    //Extraemos el payload del token que recibimos. Cualquier modificacion invalida el token
    const {uid, name} = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );

    req.uid = uid;
    req.name = name;

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido'
    })
  }

  //solo si el token es correcto
  next();
}

module.exports = {
  validarJWT
}