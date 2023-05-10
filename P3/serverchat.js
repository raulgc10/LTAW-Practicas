//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9000;

let date = new Date()
//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Inicializamos la variable de users
let users = 0;
//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/chat.html">Test</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  users = users + 1;
  console.log('** NUEVA CONEXIÓN **'.green);
  socket.send("Bienvenido al chat")
  io.send("Se ha conectado un nuevo usuario");
  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.red);
    users = users - 1;
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    if (msg == "/help"){
        socket.send("SERVER: /help: Mostrará una lista con todos los comandos soportados <br> /list: Devolverá el número de usuarios conectados <br> /hello: El servidor nos devolverá el saludo <br> /date: Nos devolverá la fecha");
    } else if (msg == "/list"){
        socket.send("SERVER: Usuarios conectados:" + users);
    } else if (msg == "/hello"){
        socket.send("SERVER: Hola!");
    } else if (msg == "/date"){
        socket.send("SERVER: " + date.toLocaleDateString("es-ES"));
    } else {
        //-- Reenviarlo a todos los clientes conectados
        io.send(msg);
    }
    
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);