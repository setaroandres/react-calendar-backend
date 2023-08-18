//Configuracion basica de express
const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./database/config');
const cors = require('cors');

//Creamos el servidor de express
const app = express();

//Conexion a base de datos
dbConnection();

//CORS - Capa de seguridad para las apis
app.use(cors());
// Parsear/Lectura del Body - Para leer lo que viene del body / request usamos este middleware
app.use(express.json());

//Rutas - Tenemos que usar el use() middleware para habilitar una ruta como válida y le hacemos el require de lo que tenemos en auth
//Le decimos que use la ruta que queremos y que importe/use la api que tenemos en el require
app.use('/api/auth', require('./routes/auth'));
//CRUD: Eventos
app.use('/api/events', require('./routes/events'));

//Aca seteamos en mostrar el directorio publico
//El use es considerado un middleware, el middleware es un fcn que se ejecuta cuando alguien hace una peticion al servidor
//En la carpeta publica vamos a colocar todo el producto de la app de react
app.use(express.static('public'));

//escuchar las peticiones, el primer arg es el puerto, el segundo un callback
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})