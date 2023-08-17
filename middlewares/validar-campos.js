//El middleware tbn tiene la req y la resp, tbn se recibe un callback (next).

const { validationResult } = require('express-validator');
const {response} = require('express');

const validarCampos = (req, res = response, next) => {
  //Aca tenemos la info de todo lo que se viene ejecutando
  //El next es una funcion que debemos llamar si el middleware se ejecuta correctamente
  //El next hace que se pase al siguiente middleware

  //Manejo de errores desde el middleware check en la ruta
  const errors = validationResult(req); //Aca colocamos la request para que evalue si hay errores con el middleware que le seteamos en la ruta
  //console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }

  next();

}

module.exports = {
  validarCampos
}