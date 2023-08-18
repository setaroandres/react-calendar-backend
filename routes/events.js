/**
 * Rutas de eventos
 * host + /api/events - Esto usamos en el postman + la que el pasemos aca en el router.get
 * 
 */

const {Router} = require('express');
const { geteventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Podemos aplicar el validarJWT en todas las rutas, asi no repetimos la llamada de un middleware en cada ruta
router.use(validarJWT);//Si queremos que una ruta no utilice este middleware lo ponemos por debajo de esa ruta y no lo va a aplicar

//obtener Eventos
router.get('/', geteventos);

//crear eventos
router.post('/', 
//Una vez que hacemos el check tenemos que usar el middleware de validar campos para que corte la ejecucion
  [
    check('title', 'El tituto es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),//Aca podemos mandar customValidators (este lo creamos en helpers)
    check('end', 'Fecha de finalización es obligatorio').custom(isDate),//Aca podemos mandar customValidators (este lo creamos en helpers)
    validarCampos
  ], 
  crearEvento
)

//actualizar evento
router.put('/:id', [
  check('title', 'El tituto es obligatorio').not().isEmpty(),
  check('start', 'Fecha de inicio es obligatorio').custom(isDate),//Aca podemos mandar customValidators (este lo creamos en helpers)
  check('end', 'Fecha de finalización es obligatorio').custom(isDate),//Aca podemos mandar customValidators (este lo creamos en helpers)
  validarCampos
], actualizarEvento)

//borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router;