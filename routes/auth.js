/**
 * Rutas de usuarios / autenticacion
 * host + /api/auth - Esto usamos en el postman + la que el pasemos aca en el router.get
 * 
 */

const {Router} = require('express');
const {check} = require('express-validator');//el cheche ese l middleware que se va a encargar de vaidar un campo en particular
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const router = Router();
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

//Configuramos nuestras rutas. Primero le pasamos la ruta y luego el callback con el request y el response (es lo que se solicita y lo que responsemos)
//Siempre que hagamos una peticion tenemos que hacer una respuesta
//Esta va a ser la API para crear un nuevo usuario - /api/auth/new
//Toda la logica de estas apis las ponemos en la carpeta controllers
//Podemos implementar middlewares en la rutas para que se ejecuten antes de ir a la funcion y podamos hacer validaciones, los colocamos como una coleccion en el segundo parametro
router.post(
  '/new', 
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
    //En vez de hacer la validacion en cada controller hacemos un custom middleware y los validamos ahi.
    validarCampos
  ], //middlewares
  crearUsuario
);

//API para registro
router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
    validarCampos
  ],
  loginUsuario
);

//API para renew del token que nos va a servir para dejar a nuestros usuarios logueados de forma pasiva sin necesidad de vovler a hacer peticiones de login - ,antenemos la sesion
//Aca podemos estirar y renovar la duracion del token valido
router.get('/renew', validarJWT, revalidarToken);

//Una vez que tenemos la ruta la tenemos que exportar para que pueda ser utilizada en el use correspondiente en el index.js

module.exports = router;