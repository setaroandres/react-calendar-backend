const jwt = require('jsonwebtoken');

//recibimos lo que colocamos como payload de nuestro token
const generarJWT = (uid, name) => {

  //Retornamos una promesa para poder esperar que todo se ejecute. Las promesas reciben un callback.
  return new Promise((resolve, reject) => {

    //Aca realizamos todo el proceso de generacion del JWT. Si se genera todo bien resolvemos con el resolve y sino con el reject
    //Primero creamos el payload
    const payload = {uid, name};

    //Generamos el token. El segundo parametro es la palabra clave, la cual la guardamos en nuestro archivo de variables globales.
    //el Tercer param son las opciones
    //Desp tenemos un callback que se va a disparar con un error si no se puede firmar
    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h',
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('No se pudo generar el token')
      }
      //Si todo se hace correctamente
      resolve(token);
    });

  });

}

module.exports = {
  generarJWT
}